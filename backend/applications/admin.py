"""
Admin configuration for Applications app
"""

from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'get_candidate',
        'get_job_title',
        'status',
        'match_score',
        'applied_at',
        'viewed_at',
        'responded_at'
    ]
    list_filter = [
        'status',
        'applied_at',
        'viewed_at'
    ]
    search_fields = [
        'candidate__id__email',
        'candidate__id__first_name',
        'candidate__id__last_name',
        'job_offer__title',
        'job_offer__recruiter__company_name'
    ]
    readonly_fields = [
        'applied_at',
        'updated_at',
        'viewed_at',
        'responded_at'
    ]
    date_hierarchy = 'applied_at'
    
    fieldsets = (
        ('Application Details', {
            'fields': ('candidate', 'job_offer', 'cover_letter', 'status')
        }),
        ('AI Matching', {
            'fields': ('match_score',)
        }),
        ('Recruiter Interaction', {
            'fields': ('recruiter_notes', 'interview_date')
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at', 'viewed_at', 'responded_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_candidate(self, obj):
        return obj.candidate.id.full_name
    get_candidate.short_description = 'Candidate'
    get_candidate.admin_order_field = 'candidate__id__last_name'
    
    def get_job_title(self, obj):
        return obj.job_offer.title
    get_job_title.short_description = 'Job'
    get_job_title.admin_order_field = 'job_offer__title'
