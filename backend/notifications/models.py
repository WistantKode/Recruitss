"""
Notification models for the recruitment platform
Handles multi-channel notifications (Email, WhatsApp, In-App)
"""

import uuid
from django.contrib.postgres.fields import ArrayField
from django.db import models

from users.models import User


class Notification(models.Model):
    """
    Notification model for multi-channel messaging
    """
    
    TYPE_CHOICES = [
        ('ACCOUNT_CREATED', 'Account Created'),
        ('APPLICATION_SUBMITTED', 'Application Submitted'),
        ('APPLICATION_STATUS_CHANGED', 'Application Status Changed'),
        ('NEW_MESSAGE', 'New Message'),
        ('JOB_MATCH', 'Job Match'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('PAYMENT_REMINDER', 'Payment Reminder'),
    ]
    
    CHANNEL_CHOICES = [
        ('EMAIL', 'Email'),
        ('WHATSAPP', 'WhatsApp'),
        ('IN_APP', 'In-App'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    # Notification details
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, db_index=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)  # Additional data
    
    # Status
    read = models.BooleanField(default=False, db_index=True)
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, null=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['type']),
            models.Index(fields=['read']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.type} for {self.user.email}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.read = True
        self.save(update_fields=['read'])
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        from django.utils import timezone
        self.sent = True
        self.sent_at = timezone.now()
        self.save(update_fields=['sent', 'sent_at'])
