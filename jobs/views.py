from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import get_object_or_404, redirect, render

from .decorators import employer_required, jobseeker_required
from .forms import (
    ApplicationForm,
    ApplicationStatusForm,
    CompanyForm,
    JobForm,
    LoginForm,
    RegisterForm,
)
from .models import Application, Company, Job, Profile


def home(request):
    """Redirect authenticated users to their role-specific dashboard."""
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            if profile.is_employer:
                return redirect('employer_dashboard')
            return redirect('jobseeker_dashboard')
        except Profile.DoesNotExist:
            logout(request)
    return redirect('job_list')


def register(request):
    """Register a new user as Employer or Job Seeker."""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
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
            messages.success(request, 'Registration successful. Please log in.')
            return redirect('login')
    else:
        form = RegisterForm()

    return render(request, 'jobs/register.html', {'form': form})


def login_view(request):
    """Authenticate users using username and password."""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(
                request,
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
            )
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {user.username}!')
                return redirect('home')
            messages.error(request, 'Invalid username or password.')
    else:
        form = LoginForm()

    return render(request, 'jobs/login.html', {'form': form})


@login_required
def logout_view(request):
    """Securely log out the current user."""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login')


@employer_required
def employer_dashboard(request):
    """Dashboard showing employer job and application statistics."""
    companies = Company.objects.filter(owner=request.user)
    jobs = Job.objects.filter(company__owner=request.user)
    applications = Application.objects.filter(job__company__owner=request.user)

    context = {
        'companies': companies,
        'job_count': jobs.count(),
        'active_job_count': jobs.filter(is_active=True).count(),
        'application_count': applications.count(),
        'recent_applications': applications.select_related('job', 'applicant')[:5],
    }
    return render(request, 'jobs/employer_dashboard.html', context)


@jobseeker_required
def jobseeker_dashboard(request):
    """Dashboard showing job seeker application summary."""
    applications = Application.objects.filter(applicant=request.user).select_related('job', 'job__company')

    context = {
        'application_count': applications.count(),
        'recent_applications': applications[:5],
        'active_jobs_count': Job.objects.filter(is_active=True).count(),
    }
    return render(request, 'jobs/jobseeker_dashboard.html', context)


@employer_required
def create_job(request):
    """Allow employers to create a new job posting."""
    companies = Company.objects.filter(owner=request.user)
    company_form = CompanyForm(prefix='company')

    if request.method == 'POST':
        job_form = JobForm(request.POST, prefix='job')

        if not companies.exists():
            company_form = CompanyForm(request.POST, prefix='company')
            if company_form.is_valid() and job_form.is_valid():
                company = company_form.save(commit=False)
                company.owner = request.user
                company.save()
                job = job_form.save(commit=False)
                job.company = company
                job.save()
                messages.success(request, 'Job created successfully.')
                return redirect('my_jobs')
        elif job_form.is_valid():
            company_id = request.POST.get('company')
            if not company_id:
                messages.error(request, 'Please select a company.')
            else:
                company = get_object_or_404(Company, pk=company_id, owner=request.user)
                job = job_form.save(commit=False)
                job.company = company
                job.save()
                messages.success(request, 'Job created successfully.')
                return redirect('my_jobs')
    else:
        company_form = CompanyForm(prefix='company')
        job_form = JobForm(prefix='job')

    return render(request, 'jobs/create_job.html', {
        'form': job_form,
        'company_form': company_form,
        'companies': companies,
        'needs_company': not companies.exists(),
    })


@employer_required
def edit_job(request, job_id):
    """Allow employers to edit only their own jobs."""
    job = get_object_or_404(Job, pk=job_id, company__owner=request.user)

    if request.method == 'POST':
        form = JobForm(request.POST, instance=job)
        if form.is_valid():
            form.save()
            messages.success(request, 'Job updated successfully.')
            return redirect('my_jobs')
    else:
        form = JobForm(instance=job)

    return render(request, 'jobs/edit_job.html', {'form': form, 'job': job})


@employer_required
def delete_job(request, job_id):
    """Allow employers to delete only their own jobs."""
    job = get_object_or_404(Job, pk=job_id, company__owner=request.user)

    if request.method == 'POST':
        job.delete()
        messages.success(request, 'Job deleted successfully.')
        return redirect('my_jobs')

    return render(request, 'jobs/delete_job.html', {'job': job})


@employer_required
def my_jobs(request):
    """List all jobs posted by the authenticated employer."""
    jobs = Job.objects.filter(company__owner=request.user).select_related('company')
    return render(request, 'jobs/my_jobs.html', {'jobs': jobs})


@login_required
def job_list(request):
    """Browse all active job listings (public for authenticated users)."""
    jobs = Job.objects.filter(is_active=True).select_related('company')
    return render(request, 'jobs/job_list.html', {'jobs': jobs})


@login_required
def job_detail(request, job_id):
    """Display detailed information for a single job."""
    job = get_object_or_404(Job, pk=job_id, is_active=True)
    has_applied = False

    if request.user.is_authenticated and hasattr(request.user, 'profile'):
        if request.user.profile.is_jobseeker:
            has_applied = Application.objects.filter(job=job, applicant=request.user).exists()

    return render(request, 'jobs/job_detail.html', {
        'job': job,
        'has_applied': has_applied,
    })


@jobseeker_required
def apply_job(request, job_id):
    """Submit an application for a job; prevent duplicate applications."""
    job = get_object_or_404(Job, pk=job_id, is_active=True)

    if Application.objects.filter(job=job, applicant=request.user).exists():
        messages.warning(request, 'You have already applied for this job.')
        return redirect('job_detail', job_id=job.pk)

    if request.method == 'POST':
        form = ApplicationForm(request.POST)
        if form.is_valid():
            application = form.save(commit=False)
            application.job = job
            application.applicant = request.user
            try:
                application.save()
            except IntegrityError:
                messages.warning(request, 'You have already applied for this job.')
                return redirect('job_detail', job_id=job.pk)
            messages.success(request, 'Application submitted successfully.')
            return redirect('my_applications')
    else:
        form = ApplicationForm()

    return render(request, 'jobs/apply_job.html', {'form': form, 'job': job})


@jobseeker_required
def my_applications(request):
    """Track all applications submitted by the job seeker."""
    applications = (
        Application.objects.filter(applicant=request.user)
        .select_related('job', 'job__company')
        .order_by('-applied_at')
    )
    return render(request, 'jobs/my_applications.html', {'applications': applications})


@employer_required
def applicants_list(request, job_id):
    """View all applicants for a specific job owned by the employer."""
    job = get_object_or_404(Job, pk=job_id, company__owner=request.user)
    applications = job.applications.select_related('applicant', 'applicant__profile')
    return render(request, 'jobs/applicants_list.html', {
        'job': job,
        'applications': applications,
    })


@employer_required
def update_application_status(request, application_id):
    """Update the status of an application for an employer's job."""
    application = get_object_or_404(
        Application,
        pk=application_id,
        job__company__owner=request.user,
    )

    if request.method == 'POST':
        form = ApplicationStatusForm(request.POST, instance=application)
        if form.is_valid():
            form.save()
            messages.success(request, 'Application status updated.')
            return redirect('applicants_list', job_id=application.job.pk)
    else:
        form = ApplicationStatusForm(instance=application)

    return render(request, 'jobs/update_application_status.html', {
        'form': form,
        'application': application,
    })
