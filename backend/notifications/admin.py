"""
Admin configuration for Notifications app
"""

from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'get_user',
        'type',
        'channel',
        'title',
        'read',
        'sent',
        'created_at',
        'sent_at'
    ]
    list_filter = [
        'type',
        'channel',
        'read',
        'sent',
        'created_at'
    ]
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'title',
        'message'
    ]
    readonly_fields = ['created_at', 'sent_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Recipient', {
            'fields': ('user',)
        }),
        ('Notification Details', {
            'fields': ('type', 'channel', 'title', 'message', 'data')
        }),
        ('Status', {
            'fields': ('read', 'sent', 'sent_at', 'error_message')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
    
    def get_user(self, obj):
        return obj.user.email
    get_user.short_description = 'User'
    get_user.admin_order_field = 'user__email'
