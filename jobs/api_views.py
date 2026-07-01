import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .decorators import api_employer_required, api_jobseeker_required, api_login_required
from .forms import ApplicationForm, ApplicationStatusForm, CompanyForm, JobForm, RegisterForm
from .models import Application, Company, Job, Profile
from .serializers import (
    serialize_application,
    serialize_company,
    serialize_job,
    serialize_user,
)


def _json_body(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}


def _error(message, status=400):
    return JsonResponse({'error': message}, status=status)


def _form_errors(form):
    errors = {}
    for field, field_errors in form.errors.items():
        errors[field] = field_errors[0] if field_errors else 'Invalid value'
    return JsonResponse({'errors': errors}, status=400)


@ensure_csrf_cookie
@require_http_methods(['GET'])
def api_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


@require_http_methods(['POST'])
def api_register(request):
    data = _json_body(request)
    form = RegisterForm(data)
    if not form.is_valid():
        return _form_errors(form)

    user = User.objects.create_user(
        username=form.cleaned_data['username'],
        email=form.cleaned_data['email'],
        password=form.cleaned_data['password'],
    )
    Profile.objects.create(
        user=user,
        role=form.cleaned_data['role'],
        phone=form.cleaned_data.get('phone', ''),
        location=form.cleaned_data.get('location', ''),
    )
    return JsonResponse({'message': 'Registration successful. Please log in.'}, status=201)


@require_http_methods(['POST'])
def api_login(request):
    data = _json_body(request)
    username = data.get('username', '')
    password = data.get('password', '')

    user = authenticate(request, username=username, password=password)
    if user is None:
        return _error('Invalid username or password.', 401)

    login(request, user)
    return JsonResponse({'user': serialize_user(user)})


@api_login_required
@require_http_methods(['POST'])
def api_logout(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully.'})


@api_login_required
@require_http_methods(['GET'])
def api_me(request):
    return JsonResponse({'user': serialize_user(request.user)})


@api_employer_required
@require_http_methods(['GET'])
def api_employer_dashboard(request):
    jobs = Job.objects.filter(company__owner=request.user)
    applications = Application.objects.filter(job__company__owner=request.user).select_related(
        'job', 'applicant'
    )
    return JsonResponse({
        'job_count': jobs.count(),
        'active_job_count': jobs.filter(is_active=True).count(),
        'application_count': applications.count(),
        'companies_count': Company.objects.filter(owner=request.user).count(),
        'recent_applications': [serialize_application(a) for a in applications[:5]],
    })


@api_jobseeker_required
@require_http_methods(['GET'])
def api_jobseeker_dashboard(request):
    applications = Application.objects.filter(applicant=request.user).select_related('job', 'job__company')
    return JsonResponse({
        'application_count': applications.count(),
        'active_jobs_count': Job.objects.filter(is_active=True).count(),
        'recent_applications': [serialize_application(a) for a in applications[:5]],
    })


@api_employer_required
@require_http_methods(['GET'])
def api_companies(request):
    companies = Company.objects.filter(owner=request.user)
    return JsonResponse({'companies': [serialize_company(c) for c in companies]})


@api_employer_required
@require_http_methods(['GET', 'POST'])
def api_employer_jobs(request):
    if request.method == 'GET':
        jobs = Job.objects.filter(company__owner=request.user).select_related('company')
        return JsonResponse({'jobs': [serialize_job(j) for j in jobs]})

    data = _json_body(request)
    companies = Company.objects.filter(owner=request.user)

    if not companies.exists():
        company_form = CompanyForm(data.get('company', {}))
        job_form = JobForm(data.get('job', data))
        if company_form.is_valid() and job_form.is_valid():
            company = company_form.save(commit=False)
            company.owner = request.user
            company.save()
            job = job_form.save(commit=False)
            job.company = company
            job.save()
            return JsonResponse({'job': serialize_job(job)}, status=201)
        errors = {}
        if company_form.errors:
            errors['company'] = {k: v[0] for k, v in company_form.errors.items()}
        if job_form.errors:
            errors['job'] = {k: v[0] for k, v in job_form.errors.items()}
        return JsonResponse({'errors': errors}, status=400)

    job_form = JobForm(data.get('job', data))
    if not job_form.is_valid():
        return _form_errors(job_form)

    company_id = data.get('company_id')
    if not company_id:
        return _error('company_id is required.')

    try:
        company = Company.objects.get(pk=company_id, owner=request.user)
    except Company.DoesNotExist:
        return _error('Company not found.', 404)

    job = job_form.save(commit=False)
    job.company = company
    job.save()
    return JsonResponse({'job': serialize_job(job)}, status=201)


@api_employer_required
@require_http_methods(['GET', 'PUT', 'DELETE'])
def api_employer_job_detail(request, job_id):
    try:
        job = Job.objects.select_related('company').get(pk=job_id, company__owner=request.user)
    except Job.DoesNotExist:
        return _error('Job not found.', 404)

    if request.method == 'GET':
        return JsonResponse({'job': serialize_job(job)})

    if request.method == 'DELETE':
        job.delete()
        return JsonResponse({'message': 'Job deleted successfully.'})

    data = _json_body(request)
    form = JobForm(data, instance=job)
    if not form.is_valid():
        return _form_errors(form)
    job = form.save()
    return JsonResponse({'job': serialize_job(job)})


@api_employer_required
@require_http_methods(['GET'])
def api_applicants(request, job_id):
    try:
        job = Job.objects.get(pk=job_id, company__owner=request.user)
    except Job.DoesNotExist:
        return _error('Job not found.', 404)

    applications = job.applications.select_related('applicant', 'applicant__profile')
    return JsonResponse({
        'job': serialize_job(job),
        'applications': [serialize_application(a, include_cover_letter=True) for a in applications],
    })


@api_employer_required
@require_http_methods(['PATCH'])
def api_update_application_status(request, application_id):
    try:
        application = Application.objects.select_related('job', 'applicant').get(
            pk=application_id,
            job__company__owner=request.user,
        )
    except Application.DoesNotExist:
        return _error('Application not found.', 404)

    data = _json_body(request)
    form = ApplicationStatusForm(data, instance=application)
    if not form.is_valid():
        return _form_errors(form)

    application = form.save()
    return JsonResponse({'application': serialize_application(application, include_cover_letter=True)})


@api_login_required
@require_http_methods(['GET'])
def api_jobs(request):
    jobs = Job.objects.filter(is_active=True).select_related('company')
    return JsonResponse({'jobs': [serialize_job(j, include_description=False) for j in jobs]})


@api_login_required
@require_http_methods(['GET'])
def api_job_detail(request, job_id):
    try:
        job = Job.objects.select_related('company').get(pk=job_id, is_active=True)
    except Job.DoesNotExist:
        return _error('Job not found.', 404)

    has_applied = False
    if hasattr(request.user, 'profile') and request.user.profile.is_jobseeker:
        has_applied = Application.objects.filter(job=job, applicant=request.user).exists()

    return JsonResponse({'job': serialize_job(job), 'has_applied': has_applied})


@api_jobseeker_required
@require_http_methods(['POST'])
def api_apply_job(request, job_id):
    try:
        job = Job.objects.get(pk=job_id, is_active=True)
    except Job.DoesNotExist:
        return _error('Job not found.', 404)

    if Application.objects.filter(job=job, applicant=request.user).exists():
        return _error('You have already applied for this job.', 409)

    data = _json_body(request)
    form = ApplicationForm(data)
    if not form.is_valid():
        return _form_errors(form)

    application = form.save(commit=False)
    application.job = job
    application.applicant = request.user
    try:
        application.save()
    except IntegrityError:
        return _error('You have already applied for this job.', 409)

    return JsonResponse({'application': serialize_application(application)}, status=201)


@api_jobseeker_required
@require_http_methods(['GET'])
def api_my_applications(request):
    applications = (
        Application.objects.filter(applicant=request.user)
        .select_related('job', 'job__company')
        .order_by('-applied_at')
    )
    return JsonResponse({'applications': [serialize_application(a) for a in applications]})
