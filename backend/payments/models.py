"""
Payment models for the recruitment platform
Handles recruiter subscription payments and transactions
"""

import uuid
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from users.models import Recruiter


class Payment(models.Model):
    """
    Payment model for tracking recruiter subscription payments
    """
    
    METHOD_CHOICES = [
        ('MANUAL', 'Manual Payment'),
        ('MOBILE_MONEY', 'Mobile Money'),
        ('STRIPE', 'Stripe'),
        ('WHATSAPP_BUSINESS', 'WhatsApp Business'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recruiter = models.ForeignKey(
        Recruiter,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    
    # Payment details
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='XOF')
    method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        db_index=True
    )
    
    # Transaction references
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True
    )
    external_reference = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )  # Reference from payment gateway (Stripe, MoMo, etc.)
    
    # Manual payment proof
    payment_proof_url = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )  # URL to uploaded payment proof for manual payments
    notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)  # Subscription validity
    
    # Refund
    refunded_at = models.DateTimeField(null=True, blank=True)
    refund_reason = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recruiter']),
            models.Index(fields=['status']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['transaction_id']),
        ]
    
    def __str__(self):
        return f"Payment {self.id} - {self.recruiter.company_name} - {self.amount} {self.currency}"
    
    def mark_as_paid(self, transaction_id=None):
        """Mark payment as completed"""
        self.status = 'COMPLETED'
        self.paid_at = timezone.now()
        if transaction_id:
            self.transaction_id = transaction_id
        
        # Calculate subscription validity (e.g., 30 days from payment)
        if not self.valid_until:
            from datetime import timedelta
            self.valid_until = timezone.now().date() + timedelta(days=30)
        
        # Update recruiter payment status
        self.recruiter.payment_status = 'ACTIVE'
        self.recruiter.subscription_valid_until = self.valid_until
        self.recruiter.save(update_fields=['payment_status', 'subscription_valid_until'])
        
        self.save()
    
    def mark_as_failed(self, error_message=None):
        """Mark payment as failed"""
        self.status = 'FAILED'
        if error_message:
            self.notes = error_message
        self.save()
    
    def refund(self, reason=None):
        """Refund the payment"""
        self.status = 'REFUNDED'
        self.refunded_at = timezone.now()
        if reason:
            self.refund_reason = reason
        
        # Update recruiter payment status
        self.recruiter.payment_status = 'SUSPENDED'
        self.recruiter.save(update_fields=['payment_status'])
        
        self.save()
