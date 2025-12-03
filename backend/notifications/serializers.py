"""
Serializers for Notifications app
"""

from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'channel', 'title', 'message', 'data',
            'read', 'sent', 'sent_at', 'error_message', 'created_at'
        ]
        read_only_fields = [
            'id', 'user', 'sent', 'sent_at', 'error_message', 'created_at'
        ]


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing notifications"""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'channel', 'title', 'message', 'read',
            'created_at'
        ]


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications"""
    
    class Meta:
        model = Notification
        fields = ['user', 'type', 'channel', 'title', 'message', 'data']
