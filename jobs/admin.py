from django.contrib import admin

from .models import Application, Company, Job, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone', 'location')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'phone', 'location')


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'website', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'owner__username')
    raw_id_fields = ('owner',)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'salary', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'location')
    search_fields = ('title', 'company__name', 'location')
    raw_id_fields = ('company',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant', 'job', 'status', 'applied_at')
    list_filter = ('status', 'applied_at')
    search_fields = ('applicant__username', 'job__title')
    raw_id_fields = ('job', 'applicant')
