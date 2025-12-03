"""
Serializers for Jobs app
Handles serialization of JobOffer and SavedJob models
"""

from rest_framework import serializers
from .models import JobOffer, SavedJob
from users.serializers import RecruiterListSerializer


class JobOfferSerializer(serializers.ModelSerializer):
    """Serializer for JobOffer model"""
    
    recruiter_info = RecruiterListSerializer(source='recruiter', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = JobOffer
        fields = [
            'id', 'recruiter', 'recruiter_info', 'title', 'description',
            'requirements', 'responsibilities', 'salary_min', 'salary_max',
            'salary_currency', 'salary_period', 'contract_type', 'location',
            'is_remote', 'skills_required', 'experience_level', 'education_required',
            'status', 'rejection_reason', 'published_at', 'expires_at', 'closed_at',
            'views_count', 'applications_count', 'is_active', 'days_remaining',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'recruiter_info', 'views_count', 'applications_count',
            'is_active', 'days_remaining', 'created_at', 'updated_at',
            'published_at', 'closed_at'
        ]
    
    def validate(self, attrs):
        """Validate salary range"""
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                "salary_max": "Maximum salary must be greater than or equal to minimum salary."
            })
        
        return attrs


class JobOfferListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing job offers"""
    
    company_name = serializers.CharField(source='recruiter.company_name', read_only=True)
    company_logo = serializers.CharField(source='recruiter.company_logo_url', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = JobOffer
        fields = [
            'id', 'title', 'company_name', 'company_logo', 'contract_type',
            'location', 'is_remote', 'salary_min', 'salary_max', 'salary_currency',
            'experience_level', 'status', 'published_at', 'expires_at',
            'views_count', 'applications_count', 'is_active', 'created_at'
        ]


class JobOfferDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for JobOffer with full information"""
    
    recruiter_info = RecruiterListSerializer(source='recruiter', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = JobOffer
        fields = '__all__'
        read_only_fields = [
            'id', 'recruiter', 'recruiter_info', 'views_count', 'applications_count',
            'is_active', 'days_remaining', 'created_at', 'updated_at',
            'published_at', 'closed_at'
        ]


class JobOfferCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job offers"""
    
    class Meta:
        model = JobOffer
        fields = [
            'title', 'description', 'requirements', 'responsibilities',
            'salary_min', 'salary_max', 'salary_currency', 'salary_period',
            'contract_type', 'location', 'is_remote', 'skills_required',
            'experience_level', 'education_required', 'expires_at'
        ]
    
    def validate(self, attrs):
        """Validate job offer data"""
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                "salary_max": "Maximum salary must be greater than or equal to minimum salary."
            })
        
        return attrs
    
    def create(self, validated_data):
        """Create job offer with recruiter from request"""
        # The recruiter will be set in the view from request.user
        return super().create(validated_data)


class SavedJobSerializer(serializers.ModelSerializer):
    """Serializer for SavedJob model"""
    
    job_details = JobOfferListSerializer(source='job_offer', read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'candidate', 'job_offer', 'job_details', 'saved_at']
        read_only_fields = ['id', 'candidate', 'job_details', 'saved_at']
    
    def validate(self, attrs):
        """Validate that job is not already saved"""
        candidate = self.context['request'].user.candidate_profile
        job_offer = attrs.get('job_offer')
        
        if SavedJob.objects.filter(candidate=candidate, job_offer=job_offer).exists():
            raise serializers.ValidationError("You have already saved this job.")
        
        return attrs
