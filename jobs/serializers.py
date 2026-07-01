"""JSON serializers for API responses."""

from .models import Application, Company, Job, Profile


def serialize_user(user):
    profile = getattr(user, 'profile', None)
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': profile.role if profile else None,
        'phone': profile.phone if profile else '',
        'location': profile.location if profile else '',
    }


def serialize_company(company):
    return {
        'id': company.id,
        'name': company.name,
        'description': company.description,
        'website': company.website,
        'created_at': company.created_at.isoformat(),
    }


def serialize_job(job, include_description=True):
    data = {
        'id': job.id,
        'title': job.title,
        'location': job.location,
        'salary': str(job.salary) if job.salary is not None else None,
        'is_active': job.is_active,
        'created_at': job.created_at.isoformat(),
        'updated_at': job.updated_at.isoformat(),
        'company': serialize_company(job.company),
    }
    if include_description:
        data['description'] = job.description
    return data


def serialize_application(application, include_cover_letter=False):
    data = {
        'id': application.id,
        'status': application.status,
        'status_display': application.get_status_display(),
        'applied_at': application.applied_at.isoformat(),
        'job': serialize_job(application.job, include_description=False),
        'applicant': {
            'id': application.applicant.id,
            'username': application.applicant.username,
            'email': application.applicant.email,
        },
    }
    if include_cover_letter:
        data['cover_letter'] = application.cover_letter
    return data
