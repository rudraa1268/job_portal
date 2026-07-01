from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('employer/dashboard/', views.employer_dashboard, name='employer_dashboard'),
    path('jobseeker/dashboard/', views.jobseeker_dashboard, name='jobseeker_dashboard'),
    path('employer/jobs/create/', views.create_job, name='create_job'),
    path('employer/jobs/<int:job_id>/edit/', views.edit_job, name='edit_job'),
    path('employer/jobs/<int:job_id>/delete/', views.delete_job, name='delete_job'),
    path('employer/jobs/', views.my_jobs, name='my_jobs'),
    path('employer/jobs/<int:job_id>/applicants/', views.applicants_list, name='applicants_list'),
    path(
        'employer/applications/<int:application_id>/status/',
        views.update_application_status,
        name='update_application_status',
    ),
    path('jobs/', views.job_list, name='job_list'),
    path('jobs/<int:job_id>/', views.job_detail, name='job_detail'),
    path('jobs/<int:job_id>/apply/', views.apply_job, name='apply_job'),
    path('my-applications/', views.my_applications, name='my_applications'),
]
