"""
Serializers for Applications app
Handles serialization of Application model
"""

from rest_framework import serializers
from .models import Application
from jobs.serializers import JobOfferListSerializer
from users.serializers import CandidateListSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Application model"""
    
    candidate_info = CandidateListSerializer(source='candidate', read_only=True)
    job_info = JobOfferListSerializer(source='job_offer', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'candidate', 'candidate_info', 'job_offer', 'job_info',
            'cover_letter', 'status', 'match_score', 'recruiter_notes',
            'interview_date', 'applied_at', 'updated_at', 'viewed_at',
            'responded_at'
        ]
        read_only_fields = [
            'id', 'candidate', 'candidate_info', 'job_info', 'match_score',
            'applied_at', 'updated_at', 'viewed_at', 'responded_at'
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating applications"""
    
    class Meta:
        model = Application
        fields = ['job_offer', 'cover_letter']
    
    def validate_job_offer(self, value):
        """Validate that job offer is active and user hasn't already applied"""
        if not value.is_active:
            raise serializers.ValidationError("This job offer is no longer active.")
        
        # Check if already applied
        candidate = self.context['request'].user.candidate_profile
        if Application.objects.filter(candidate=candidate, job_offer=value).exists():
            raise serializers.ValidationError("You have already applied to this job.")
        
        return value
    
    def create(self, validated_data):
        """Create application with candidate from request"""
        candidate = self.context['request'].user.candidate_profile
        validated_data['candidate'] = candidate
        return super().create(validated_data)


class ApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing applications"""
    
    candidate_name = serializers.CharField(source='candidate.id.full_name', read_only=True)
    candidate_email = serializers.EmailField(source='candidate.id.email', read_only=True)
    job_title = serializers.CharField(source='job_offer.title', read_only=True)
    company_name = serializers.CharField(source='job_offer.recruiter.company_name', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'candidate_name', 'candidate_email', 'job_title',
            'company_name', 'status', 'match_score', 'applied_at'
        ]


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating application status (by recruiter)"""
    
    class Meta:
        model = Application
        fields = ['status', 'recruiter_notes', 'interview_date']
    
    def validate_status(self, value):
        """Validate status transitions"""
        if self.instance:
            current_status = self.instance.status
            
            # Don't allow changing from WITHDRAWN
            if current_status == 'WITHDRAWN':
                raise serializers.ValidationError("Cannot change status of withdrawn application.")
            
            # Don't allow changing from ACCEPTED or REJECTED back to earlier states
            if current_status in ['ACCEPTED', 'REJECTED'] and value not in ['ACCEPTED', 'REJECTED']:
                raise serializers.ValidationError("Cannot revert status of accepted or rejected application.")
        
        return value


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Application with full information"""
    
    candidate_info = CandidateListSerializer(source='candidate', read_only=True)
    job_info = JobOfferListSerializer(source='job_offer', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = [
            'id', 'candidate', 'candidate_info', 'job_offer', 'job_info',
            'match_score', 'applied_at', 'updated_at', 'viewed_at', 'responded_at'
        ]
