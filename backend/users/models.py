"""
User models for the recruitment platform
Implements custom User model with Candidate, Recruiter, and Admin profiles
"""

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.core.validators import EmailValidator, MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user"""
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('status', 'ACTIVE')
        extra_fields.setdefault('email_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for the recruitment platform
    Supports three types of users: Candidates, Recruiters, and Admins
    """
    
    ROLE_CHOICES = [
        ('CANDIDATE', 'Candidate'),
        ('RECRUITER', 'Recruiter'),
        ('ADMIN', 'Admin'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('DELETED', 'Deleted'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        db_index=True
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        db_index=True
    )
    email_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    # Password reset
    password_reset_token = models.CharField(max_length=255, blank=True, null=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    
    # Django admin fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        """Return the user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    def save(self, *args, **kwargs):
        """Override save to update last_login_at"""
        if self.pk:
            self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class Candidate(models.Model):
    """
    Candidate profile extending User model
    Contains candidate-specific information and CV
    """
    
    id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='candidate_profile'
    )
    bio = models.TextField(blank=True, null=True)
    skills = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    experience_years = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    education = models.CharField(max_length=255, blank=True, null=True)
    
    # Salary expectations
    desired_salary_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    desired_salary_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_currency = models.CharField(max_length=3, default='XOF')
    
    # Availability
    available_from = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    
    # Files and media
    cv_url = models.CharField(max_length=500, blank=True, null=True)
    cv_filename = models.CharField(max_length=255, blank=True, null=True)
    cv_uploaded_at = models.DateTimeField(null=True, blank=True)
    profile_picture_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Social links
    linkedin_url = models.URLField(max_length=255, blank=True, null=True)
    github_url = models.URLField(max_length=255, blank=True, null=True)
    portfolio_url = models.URLField(max_length=255, blank=True, null=True)
    
    # Profile metrics
    profile_completeness = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'candidates'
        indexes = [
            models.Index(fields=['location']),
            models.Index(fields=['is_available']),
        ]
    
    def __str__(self):
        return f"Candidate: {self.id.full_name}"
    
    def calculate_profile_completeness(self):
        """Calculate and update profile completeness percentage"""
        completeness = 0
        
        # Bio (10 points)
        if self.bio and len(self.bio) > 50:
            completeness += 10
        
        # Skills (15 points)
        if self.skills and len(self.skills) >= 3:
            completeness += 15
        
        # Experience (10 points)
        if self.experience_years and self.experience_years > 0:
            completeness += 10
        
        # Education (10 points)
        if self.education:
            completeness += 10
        
        # CV (25 points)
        if self.cv_url:
            completeness += 25
        
        # Profile picture (10 points)
        if self.profile_picture_url:
            completeness += 10
        
        # Location (5 points)
        if self.location:
            completeness += 5
        
        # Desired salary (5 points)
        if self.desired_salary_min:
            completeness += 5
        
        # LinkedIn (5 points)
        if self.linkedin_url:
            completeness += 5
        
        # Portfolio (5 points)
        if self.portfolio_url:
            completeness += 5
        
        self.profile_completeness = completeness
        return completeness


class Recruiter(models.Model):
    """
    Recruiter profile extending User model
    Contains company information and subscription status
    """
    
    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1000+', '1000+ employees'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('SUSPENDED', 'Suspended'),
    ]
    
    id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='recruiter_profile'
    )
    company_name = models.CharField(max_length=255)
    company_description = models.TextField(blank=True, null=True)
    company_logo_url = models.CharField(max_length=500, blank=True, null=True)
    website = models.URLField(max_length=255, blank=True, null=True)
    company_size = models.CharField(
        max_length=50,
        choices=COMPANY_SIZE_CHOICES,
        blank=True,
        null=True
    )
    industry = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    # Payment and subscription
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='PENDING'
    )
    subscription_valid_until = models.DateField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recruiters'
        indexes = [
            models.Index(fields=['company_name']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['industry']),
        ]
    
    def __str__(self):
        return f"{self.company_name} - {self.id.full_name}"
    
    @property
    def is_subscription_valid(self):
        """Check if subscription is still valid"""
        if not self.subscription_valid_until:
            return False
        return self.subscription_valid_until >= timezone.now().date()


class Admin(models.Model):
    """
    Admin profile extending User model
    Contains admin-specific permissions and settings
    """
    
    id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='admin_profile'
    )
    permissions = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    department = models.CharField(max_length=100, blank=True, null=True)
    
    # Permission flags
    can_manage_users = models.BooleanField(default=False)
    can_manage_jobs = models.BooleanField(default=False)
    can_manage_payments = models.BooleanField(default=False)
    can_view_analytics = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admins'
    
    def __str__(self):
        return f"Admin: {self.id.full_name}"
