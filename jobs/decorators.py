from functools import wraps

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse

from .models import Profile


def _get_profile(user):
    """Return the user's profile or raise PermissionDenied."""
    try:
        return user.profile
    except Profile.DoesNotExist:
        raise PermissionDenied('User profile not found.')


def _api_forbidden(message='Permission denied.', status=403):
    return JsonResponse({'error': message}, status=status)


def api_login_required(view_func):
    """Return JSON 401 for unauthenticated API requests."""

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required.'}, status=401)
        return view_func(request, *args, **kwargs)

    return wrapper


def api_employer_required(view_func):
    """Restrict API access to authenticated employers."""

    @api_login_required
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            profile = _get_profile(request.user)
        except PermissionDenied:
            return _api_forbidden('User profile not found.')
        if not profile.is_employer:
            return _api_forbidden('This action is restricted to employers.')
        return view_func(request, *args, **kwargs)

    return wrapper


def api_jobseeker_required(view_func):
    """Restrict API access to authenticated job seekers."""

    @api_login_required
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            profile = _get_profile(request.user)
        except PermissionDenied:
            return _api_forbidden('User profile not found.')
        if not profile.is_jobseeker:
            return _api_forbidden('This action is restricted to job seekers.')
        return view_func(request, *args, **kwargs)

    return wrapper


def employer_required(view_func):
    """Restrict view access to authenticated employers only."""

    @login_required
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        profile = _get_profile(request.user)
        if not profile.is_employer:
            raise PermissionDenied('This page is restricted to employers.')
        return view_func(request, *args, **kwargs)

    return wrapper


def jobseeker_required(view_func):
    """Restrict view access to authenticated job seekers only."""

    @login_required
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        profile = _get_profile(request.user)
        if not profile.is_jobseeker:
            raise PermissionDenied('This page is restricted to job seekers.')
        return view_func(request, *args, **kwargs)

    return wrapper
