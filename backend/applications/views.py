"""
API Views for Applications app
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models

from .models import Application
from .serializers import (
    ApplicationSerializer, ApplicationListSerializer,
    ApplicationCreateSerializer, ApplicationUpdateSerializer,
    ApplicationDetailSerializer
)
from users.permissions import IsCandidate, IsRecruiter, IsCandidateOwner, IsRecruiterOwner


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Application model
    Handles job applications
    """
    queryset = Application.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job_offer', 'candidate']
    ordering_fields = ['applied_at', 'match_score']
    ordering = ['-applied_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        elif self.action == 'list':
            return ApplicationListSerializer
        elif self.action in ['update', 'partial_update']:
            return ApplicationUpdateSerializer
        elif self.action == 'retrieve':
            return ApplicationDetailSerializer
        return ApplicationSerializer
    
    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        queryset = Application.objects.all()
        
        if user.role == 'CANDIDATE':
            # Candidates see only their applications
            queryset = queryset.filter(candidate=user.candidate_profile)
        elif user.role == 'RECRUITER':
            # Recruiters see applications to their jobs
            queryset = queryset.filter(job_offer__recruiter=user.recruiter_profile)
        elif user.role != 'ADMIN':
            return Application.objects.none()
        
        return queryset.select_related('candidate', 'job_offer', 'job_offer__recruiter')
    
    def create(self, request, *args, **kwargs):
        """Create application (candidates only)"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can apply to jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        
        # TODO: Trigger notification to recruiter
        # TODO: Calculate AI match score
        
        return Response(
            ApplicationDetailSerializer(application).data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update application (recruiters only for status updates)"""
        if request.user.role not in ['RECRUITER', 'ADMIN']:
            return Response({
                'error': 'Only recruiters can update application status'
            }, status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        
        # Verify recruiter owns the job
        if request.user.role == 'RECRUITER':
            if instance.job_offer.recruiter.id != request.user:
                return Response({
                    'error': 'You can only update applications to your own jobs'
                }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # TODO: Trigger notification to candidate
        
        return Response(ApplicationDetailSerializer(instance).data)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw application (candidates only)"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can withdraw applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.candidate.id != request.user:
            return Response({
                'error': 'You can only withdraw your own applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if application.status in ['ACCEPTED', 'REJECTED']:
            return Response({
                'error': f'Cannot withdraw {application.status.lower()} application'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        application.withdraw()
        
        return Response({
            'message': 'Application withdrawn successfully',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        """Mark application as viewed (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can mark applications as viewed'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.job_offer.recruiter.id != request.user:
            return Response({
                'error': 'You can only view applications to your own jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application.mark_as_viewed()
        
        return Response({
            'message': 'Application marked as viewed',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=True, methods=['post'])
    def shortlist(self, request, pk=None):
        """Shortlist application (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can shortlist applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.job_offer.recruiter.id != request.user:
            return Response({
                'error': 'You can only shortlist applications to your own jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application.shortlist()
        
        return Response({
            'message': 'Application shortlisted successfully',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=True, methods=['post'])
    def schedule_interview(self, request, pk=None):
        """Schedule interview (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can schedule interviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.job_offer.recruiter.id != request.user:
            return Response({
                'error': 'You can only schedule interviews for your own jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        interview_date = request.data.get('interview_date')
        if not interview_date:
            return Response({
                'error': 'interview_date is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        application.schedule_interview(interview_date)
        
        # TODO: Send notification to candidate
        
        return Response({
            'message': 'Interview scheduled successfully',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject application (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can reject applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.job_offer.recruiter.id != request.user:
            return Response({
                'error': 'You can only reject applications to your own jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        reason = request.data.get('reason', '')
        application.reject(reason)
        
        # TODO: Send notification to candidate
        
        return Response({
            'message': 'Application rejected',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept application (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can accept applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if application.job_offer.recruiter.id != request.user:
            return Response({
                'error': 'You can only accept applications to your own jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        application.accept()
        
        # TODO: Send notification to candidate
        
        return Response({
            'message': 'Application accepted',
            'application': ApplicationDetailSerializer(application).data
        })
    
    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Get applications by current candidate"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        applications = Application.objects.filter(candidate=request.user.candidate_profile)
        page = self.paginate_queryset(applications)
        
        if page is not None:
            serializer = ApplicationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ApplicationListSerializer(applications, many=True)
        return Response(serializer.data)
