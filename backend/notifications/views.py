"""
API Views for Notifications app
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer, NotificationListSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Notification model
    Read-only viewset for user notifications
    """
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    def get_queryset(self):
        """Return notifications for current user"""
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        
        if notification.user != request.user:
            return Response({
                'error': 'You can only mark your own notifications as read'
            }, status=status.HTTP_403_FORBIDDEN)
        
        notification.mark_as_read()
        
        return Response({
            'message': 'Notification marked as read',
            'notification': NotificationSerializer(notification).data
        })
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read for current user"""
        count = Notification.objects.filter(
            user=request.user,
            read=False
        ).update(read=True)
        
        return Response({
            'message': f'{count} notifications marked as read'
        })
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications count"""
        count = Notification.objects.filter(
            user=request.user,
            read=False
        ).count()
        
        return Response({
            'unread_count': count
        })
