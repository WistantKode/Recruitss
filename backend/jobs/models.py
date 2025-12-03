"""
Job-related models for the recruitment platform
Includes JobOffer and SavedJobs models
"""

import uuid
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from users.models import Recruiter, Candidate


class JobOffer(models.Model):
    """
    Job offer model representing employment opportunities
    """
    
    CONTRACT_TYPE_CHOICES = [
        ('CDI', 'CDI - Permanent Contract'),
        ('CDD', 'CDD - Fixed-term Contract'),
        ('FREELANCE', 'Freelance'),
        ('INTERNSHIP', 'Internship'),
        ('APPRENTICESHIP', 'Apprenticeship'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('JUNIOR', 'Junior (0-2 years)'),
        ('INTERMEDIATE', 'Intermediate (2-5 years)'),
        ('SENIOR', 'Senior (5-10 years)'),
        ('EXPERT', 'Expert (10+ years)'),
    ]
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('CLOSED', 'Closed'),
        ('ARCHIVED', 'Archived'),
        ('REJECTED', 'Rejected'),
    ]
    
    SALARY_PERIOD_CHOICES = [
        ('HOURLY', 'Per Hour'),
        ('MONTHLY', 'Per Month'),
        ('YEARLY', 'Per Year'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recruiter = models.ForeignKey(
        Recruiter,
        on_delete=models.CASCADE,
        related_name='job_offers'
    )
    
    # Job details
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    responsibilities = models.TextField(blank=True, null=True)
    
    # Salary information
    salary_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_currency = models.CharField(max_length=3, default='XOF')
    salary_period = models.CharField(
        max_length=20,
        choices=SALARY_PERIOD_CHOICES,
        null=True,
        blank=True
    )
    
    # Job characteristics
    contract_type = models.CharField(max_length=50, choices=CONTRACT_TYPE_CHOICES)
    location = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    is_remote = models.BooleanField(default=False)
    skills_required = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    experience_level = models.CharField(
        max_length=50,
        choices=EXPERIENCE_LEVEL_CHOICES,
        null=True,
        blank=True
    )
    education_required = models.CharField(max_length=255, blank=True, null=True)
    
    # Status and lifecycle
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        db_index=True
    )
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Important dates
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    # Metrics
    views_count = models.IntegerField(default=0)
    applications_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'job_offers'
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['recruiter']),
            models.Index(fields=['status']),
            models.Index(fields=['location']),
            models.Index(fields=['contract_type']),
            models.Index(fields=['published_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recruiter.company_name}"
    
    @property
    def is_active(self):
        """Check if job offer is currently active"""
        if self.status != 'PUBLISHED':
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True
    
    @property
    def days_remaining(self):
        """Calculate days remaining until expiration"""
        if not self.expires_at:
            return None
        delta = self.expires_at - timezone.now()
        return max(0, delta.days)
    
    def publish(self):
        """Publish the job offer"""
        self.status = 'PUBLISHED'
        self.published_at = timezone.now()
        self.save()
    
    def close(self):
        """Close the job offer"""
        self.status = 'CLOSED'
        self.closed_at = timezone.now()
        self.save()
    
    def increment_views(self):
        """Increment view count"""
        self.views_count += 1
        self.save(update_fields=['views_count'])


class SavedJob(models.Model):
    """
    Saved jobs by candidates (bookmarks)
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='saved_jobs'
    )
    job_offer = models.ForeignKey(
        JobOffer,
        on_delete=models.CASCADE,
        related_name='saved_by'
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'saved_jobs'
        unique_together = ['candidate', 'job_offer']
        ordering = ['-saved_at']
        indexes = [
            models.Index(fields=['candidate']),
            models.Index(fields=['job_offer']),
        ]
    
    def __str__(self):
        return f"{self.candidate} saved {self.job_offer.title}"
