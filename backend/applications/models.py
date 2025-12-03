"""
Application-related models for the recruitment platform
Handles job applications and their lifecycle
"""

import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone

from users.models import Candidate
from jobs.models import JobOffer


class Application(models.Model):
    """
    Job application model representing candidate applications to job offers
    """
    
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('VIEWED', 'Viewed'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEW_SCHEDULED', 'Interview Scheduled'),
        ('REJECTED', 'Rejected'),
        ('ACCEPTED', 'Accepted'),
        ('WITHDRAWN', 'Withdrawn'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    job_offer = models.ForeignKey(
        JobOffer,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    
    # Application content
    cover_letter = models.TextField(blank=True, null=True)
    
    # Status and progress
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='SUBMITTED',
        db_index=True
    )
    
    # AI matching score
    match_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    # Recruiter interaction
    recruiter_notes = models.TextField(blank=True, null=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'applications'
        unique_together = ['candidate', 'job_offer']
        ordering = ['-applied_at']
        indexes = [
            models.Index(fields=['candidate']),
            models.Index(fields=['job_offer']),
            models.Index(fields=['status']),
            models.Index(fields=['-match_score']),
            models.Index(fields=['-applied_at']),
        ]
    
    def __str__(self):
        return f"{self.candidate} -> {self.job_offer.title}"
    
    def mark_as_viewed(self):
        """Mark application as viewed by recruiter"""
        if self.status == 'SUBMITTED':
            self.status = 'VIEWED'
            self.viewed_at = timezone.now()
            self.save()
    
    def shortlist(self):
        """Add application to shortlist"""
        self.status = 'SHORTLISTED'
        self.responded_at = timezone.now()
        self.save()
    
    def schedule_interview(self, interview_date):
        """Schedule an interview"""
        self.status = 'INTERVIEW_SCHEDULED'
        self.interview_date = interview_date
        self.responded_at = timezone.now()
        self.save()
    
    def reject(self, reason=None):
        """Reject the application"""
        self.status = 'REJECTED'
        self.responded_at = timezone.now()
        if reason:
            self.recruiter_notes = reason
        self.save()
    
    def accept(self):
        """Accept the application"""
        self.status = 'ACCEPTED'
        self.responded_at = timezone.now()
        self.save()
    
    def withdraw(self):
        """Withdraw the application (by candidate)"""
        self.status = 'WITHDRAWN'
        self.save()
    
    def save(self, *args, **kwargs):
        """Override save to update job offer applications count"""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Increment applications count on job offer
            self.job_offer.applications_count += 1
            self.job_offer.save(update_fields=['applications_count'])
