"""
Admin configuration for Payments app
"""

from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'get_company',
        'amount',
        'currency',
        'method',
        'status',
        'created_at',
        'paid_at',
        'valid_until'
    ]
    list_filter = [
        'status',
        'method',
        'currency',
        'created_at',
        'paid_at'
    ]
    search_fields = [
        'recruiter__company_name',
        'recruiter__id__email',
        'transaction_id',
        'external_reference'
    ]
    readonly_fields = ['created_at', 'paid_at', 'refunded_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Recruiter', {
            'fields': ('recruiter',)
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'method', 'status')
        }),
        ('Transaction References', {
            'fields': ('transaction_id', 'external_reference', 'payment_proof_url')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'paid_at', 'valid_until')
        }),
        ('Refund', {
            'fields': ('refunded_at', 'refund_reason'),
            'classes': ('collapse',)
        }),
    )
    
    def get_company(self, obj):
        return obj.recruiter.company_name
    get_company.short_description = 'Company'
    get_company.admin_order_field = 'recruiter__company_name'
