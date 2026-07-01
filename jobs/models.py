from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """Extended user profile storing role and contact information."""

    ROLE_EMPLOYER = 'employer'
    ROLE_JOBSEEKER = 'jobseeker'

    ROLE_CHOICES = (
        (ROLE_EMPLOYER, 'Employer'),
        (ROLE_JOBSEEKER, 'Job Seeker'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    @property
    def is_employer(self):
        return self.role == self.ROLE_EMPLOYER

    @property
    def is_jobseeker(self):
        return self.role == self.ROLE_JOBSEEKER


class Company(models.Model):
    """Company profile owned by an employer."""

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='companies',
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'companies'

    def __str__(self):
        return self.name


class Job(models.Model):
    """Job posting linked to a company."""

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='jobs',
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Application(models.Model):
    """Job application submitted by a job seeker."""

    STATUS_APPLIED = 'applied'
    STATUS_UNDER_REVIEW = 'under_review'
    STATUS_SHORTLISTED = 'shortlisted'
    STATUS_REJECTED = 'rejected'
    STATUS_ACCEPTED = 'accepted'

    STATUS_CHOICES = (
        (STATUS_APPLIED, 'Applied'),
        (STATUS_UNDER_REVIEW, 'Under Review'),
        (STATUS_SHORTLISTED, 'Shortlisted'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_ACCEPTED, 'Accepted'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPLIED)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'applicant')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.username} - {self.job.title} ({self.get_status_display()})"
