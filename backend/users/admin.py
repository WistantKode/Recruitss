"""
Admin configuration for Users app
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Candidate, Recruiter, Admin


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'status', 'email_verified', 'created_at']
    list_filter = ['role', 'status', 'email_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissions', {'fields': ('role', 'status', 'email_verified', 'is_staff', 'is_superuser', 'is_active')}),
        ('Important dates', {'fields': ('last_login_at', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login_at']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'get_email', 'experience_years', 'location', 'profile_completeness', 'is_available']
    list_filter = ['is_available', 'experience_years', 'created_at']
    search_fields = ['id__email', 'id__first_name', 'id__last_name', 'location']
    readonly_fields = ['created_at', 'updated_at', 'profile_completeness']
    
    def get_full_name(self, obj):
        return obj.id.full_name
    get_full_name.short_description = 'Name'
    
    def get_email(self, obj):
        return obj.id.email
    get_email.short_description = 'Email'


@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'get_email', 'industry', 'payment_status', 'verified', 'subscription_valid_until']
    list_filter = ['payment_status', 'verified', 'industry', 'company_size', 'created_at']
    search_fields = ['company_name', 'id__email', 'id__first_name', 'id__last_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_email(self, obj):
        return obj.id.email
    get_email.short_description = 'Email'


@admin.register(Admin)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'get_email', 'department', 'can_manage_users', 'can_manage_jobs']
    list_filter = ['can_manage_users', 'can_manage_jobs', 'can_manage_payments', 'can_view_analytics']
    search_fields = ['id__email', 'id__first_name', 'id__last_name', 'department']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.id.full_name
    get_full_name.short_description = 'Name'
    
    def get_email(self, obj):
        return obj.id.email
    get_email.short_description = 'Email'
