from django.urls import path

from . import api_views

urlpatterns = [
    path('auth/csrf/', api_views.api_csrf, name='api_csrf'),
    path('auth/register/', api_views.api_register, name='api_register'),
    path('auth/login/', api_views.api_login, name='api_login'),
    path('auth/logout/', api_views.api_logout, name='api_logout'),
    path('auth/me/', api_views.api_me, name='api_me'),
    path('employer/dashboard/', api_views.api_employer_dashboard, name='api_employer_dashboard'),
    path('employer/companies/', api_views.api_companies, name='api_companies'),
    path('employer/jobs/', api_views.api_employer_jobs, name='api_employer_jobs'),
    path('employer/jobs/<int:job_id>/', api_views.api_employer_job_detail, name='api_employer_job_detail'),
    path('employer/jobs/<int:job_id>/applicants/', api_views.api_applicants, name='api_applicants'),
    path(
        'employer/applications/<int:application_id>/status/',
        api_views.api_update_application_status,
        name='api_update_application_status',
    ),
    path('jobseeker/dashboard/', api_views.api_jobseeker_dashboard, name='api_jobseeker_dashboard'),
    path('jobs/', api_views.api_jobs, name='api_jobs'),
    path('jobs/<int:job_id>/', api_views.api_job_detail, name='api_job_detail'),
    path('jobs/<int:job_id>/apply/', api_views.api_apply_job, name='api_apply_job'),
    path('applications/my/', api_views.api_my_applications, name='api_my_applications'),
]
