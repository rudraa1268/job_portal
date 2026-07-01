from django import forms
from django.contrib.auth.models import User
from .models import Company, Job, Application

class TailwindFormMixin:
    """Mixin to automatically apply Tailwind CSS styling to all widgets in a form."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs['class'] = 'mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            elif isinstance(field.widget, forms.RadioSelect):
                field.widget.attrs['class'] = 'mr-1 text-indigo-600 focus:ring-indigo-500'
            else:
                field.widget.attrs['class'] = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300'


class RegisterForm(TailwindFormMixin, forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput()
    )
    
    ROLE_CHOICES = (
        ('employer', 'Employer'),
        ('jobseeker', 'Job Seeker'),
    )
    
    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        widget=forms.Select()
    )
    
    phone = forms.CharField(
        max_length=15,
        required=False
    )
    
    location = forms.CharField(
        max_length=100,
        required=False
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email


class LoginForm(TailwindFormMixin, forms.Form):
    username = forms.CharField(
        max_length=150
    )
    password = forms.CharField(
        widget=forms.PasswordInput()
    )


class CompanyForm(TailwindFormMixin, forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'description', 'website']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }


class JobForm(TailwindFormMixin, forms.ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'description', 'location', 'salary', 'is_active']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }


class ApplicationForm(TailwindFormMixin, forms.ModelForm):
    class Meta:
        model = Application
        fields = ['cover_letter']
        widgets = {
            'cover_letter': forms.Textarea(attrs={'rows': 4}),
        }


class ApplicationStatusForm(TailwindFormMixin, forms.ModelForm):
    class Meta:
        model = Application
        fields = ['status']
        widgets = {
            'status': forms.Select(),
        }