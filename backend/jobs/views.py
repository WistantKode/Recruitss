"""
API Views for Jobs app
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models

from .models import JobOffer, SavedJob
from .serializers import (
    JobOfferSerializer, JobOfferListSerializer, JobOfferDetailSerializer,
    JobOfferCreateSerializer, SavedJobSerializer
)
from users.permissions import IsRecruiter, IsActiveRecruiter, IsRecruiterOwner


class JobOfferViewSet(viewsets.ModelViewSet):
    """
    ViewSet for JobOffer model
    Provides CRUD operations for job offers
    """
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'contract_type', 'experience_level', 'is_remote', 'location']
    search_fields = ['title', 'description', 'skills_required']
    ordering_fields = ['created_at', 'published_at', 'salary_min', 'applications_count', 'views_count']
    ordering = ['-published_at', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return JobOfferCreateSerializer
        elif self.action == 'list':
            return JobOfferListSerializer
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return JobOfferDetailSerializer
        return JobOfferSerializer
    
    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        queryset = JobOffer.objects.all()
        
        if user.role == 'RECRUITER':
            # Recruiters see their own jobs and published jobs from others
            queryset = queryset.filter(
                models.Q(recruiter=user.recruiter_profile) | 
                models.Q(status='PUBLISHED')
            )
        elif user.role == 'CANDIDATE':
            # Candidates only see published jobs
            queryset = queryset.filter(status='PUBLISHED')
        
        return queryset
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            return [IsActiveRecruiter()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsRecruiterOwner()]
        elif self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()] if self.action == 'list' else [IsAuthenticated()]
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """Create job offer"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set recruiter from request user
        job_offer = serializer.save(recruiter=request.user.recruiter_profile)
        
        return Response(
            JobOfferDetailSerializer(job_offer).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve job offer and increment view count"""
        instance = self.get_object()
        
        # Increment views if not the owner
        if request.user.is_authenticated:
            if request.user.role != 'RECRUITER' or instance.recruiter.id != request.user:
                instance.increment_views()
        else:
            instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsRecruiterOwner])
    def publish(self, request, pk=None):
        """Publish a job offer"""
        job_offer = self.get_object()
        
        if job_offer.status != 'DRAFT':
            return Response({
                'error': 'Only draft jobs can be published'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        job_offer.publish()
        
        return Response({
            'message': 'Job offer published successfully',
            'job': JobOfferDetailSerializer(job_offer).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsRecruiterOwner])
    def close(self, request, pk=None):
        """Close a job offer"""
        job_offer = self.get_object()
        
        if job_offer.status != 'PUBLISHED':
            return Response({
                'error': 'Only published jobs can be closed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        job_offer.close()
        
        return Response({
            'message': 'Job offer closed successfully',
            'job': JobOfferDetailSerializer(job_offer).data
        })
    
    @action(detail=False, methods=['get'])
    def my_jobs(self, request):
        """Get jobs created by current recruiter"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        jobs = JobOffer.objects.filter(recruiter=request.user.recruiter_profile)
        page = self.paginate_queryset(jobs)
        
        if page is not None:
            serializer = JobOfferListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = JobOfferListSerializer(jobs, many=True)
        return Response(serializer.data)


class SavedJobViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SavedJob model
    Allows candidates to save/bookmark jobs
    """
    queryset = SavedJob.objects.all()
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return saved jobs for current candidate"""
        if self.request.user.role == 'CANDIDATE':
            return SavedJob.objects.filter(candidate=self.request.user.candidate_profile)
        return SavedJob.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Save a job for the current candidate"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can save jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        saved_job = serializer.save(candidate=request.user.candidate_profile)
        
        return Response(
            SavedJobSerializer(saved_job).data,
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        """Remove a saved job"""
        instance = self.get_object()
        
        if instance.candidate.id != request.user:
            return Response({
                'error': 'You can only delete your own saved jobs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
