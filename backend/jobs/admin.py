"""
Admin configuration for Jobs app
"""

from django.contrib import admin
from .models import JobOffer, SavedJob


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'get_company',
        'contract_type',
        'location',
        'status',
        'applications_count',
        'views_count',
        'published_at',
        'expires_at'
    ]
    list_filter = [
        'status',
        'contract_type',
        'experience_level',
        'is_remote',
        'created_at',
        'published_at'
    ]
    search_fields = [
        'title',
        'description',
        'recruiter__company_name',
        'location'
    ]
    readonly_fields = [
        'views_count',
        'applications_count',
        'created_at',
        'updated_at'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('recruiter', 'title', 'description', 'requirements', 'responsibilities')
        }),
        ('Job Details', {
            'fields': ('contract_type', 'location', 'is_remote', 'experience_level', 'education_required')
        }),
        ('Skills', {
            'fields': ('skills_required',)
        }),
        ('Salary', {
            'fields': ('salary_min', 'salary_max', 'salary_currency', 'salary_period')
        }),
        ('Status & Lifecycle', {
            'fields': ('status', 'rejection_reason', 'published_at', 'expires_at', 'closed_at')
        }),
        ('Metrics', {
            'fields': ('views_count', 'applications_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_company(self, obj):
        return obj.recruiter.company_name
    get_company.short_description = 'Company'
    get_company.admin_order_field = 'recruiter__company_name'


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['get_candidate', 'get_job_title', 'saved_at']
    list_filter = ['saved_at']
    search_fields = [
        'candidate__id__email',
        'candidate__id__first_name',
        'candidate__id__last_name',
        'job_offer__title'
    ]
    readonly_fields = ['saved_at']
    
    def get_candidate(self, obj):
        return obj.candidate.id.full_name
    get_candidate.short_description = 'Candidate'
    
    def get_job_title(self, obj):
        return obj.job_offer.title
    get_job_title.short_description = 'Job Title'
