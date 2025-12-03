"""
Serializers for Users app
Handles serialization of User, Candidate, Recruiter, and Admin models
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Candidate, Recruiter, Admin


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone', 'role',
            'status', 'email_verified', 'created_at', 'updated_at',
            'last_login_at', 'password', 'password_confirm'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at',
                            'last_login_at', 'status', 'email_verified']
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True}
        }

    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for User model (without password)"""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'phone',
            'role', 'status', 'email_verified', 'created_at', 'updated_at',
            'last_login_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at',
                            'updated_at', 'last_login_at', 'full_name']


class CandidateSerializer(serializers.ModelSerializer):
    """Serializer for Candidate profile"""

    user = UserDetailSerializer(source='id', read_only=True)
    email = serializers.EmailField(source='id.email', read_only=True)
    full_name = serializers.CharField(source='id.full_name', read_only=True)

    class Meta:
        model = Candidate
        fields = [
            'id', 'user', 'email', 'full_name', 'bio', 'skills', 'experience_years',
            'education', 'desired_salary_min', 'desired_salary_max', 'salary_currency',
            'available_from', 'location', 'is_available', 'cv_url', 'cv_filename',
            'cv_uploaded_at', 'profile_picture_url', 'linkedin_url', 'github_url',
            'portfolio_url', 'profile_completeness', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'email', 'full_name',
                            'profile_completeness', 'cv_uploaded_at', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        """Update candidate and recalculate profile completeness"""
        instance = super().update(instance, validated_data)
        instance.calculate_profile_completeness()
        instance.save()
        return instance


class CandidateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing candidates"""

    email = serializers.EmailField(source='id.email', read_only=True)
    full_name = serializers.CharField(source='id.full_name', read_only=True)

    class Meta:
        model = Candidate
        fields = [
            'id', 'email', 'full_name', 'experience_years', 'location',
            'is_available', 'profile_completeness', 'skills'
        ]


class RecruiterSerializer(serializers.ModelSerializer):
    """Serializer for Recruiter profile"""

    user = UserDetailSerializer(source='id', read_only=True)
    email = serializers.EmailField(source='id.email', read_only=True)
    full_name = serializers.CharField(source='id.full_name', read_only=True)
    is_subscription_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Recruiter
        fields = [
            'id', 'user', 'email', 'full_name', 'company_name', 'company_description',
            'company_logo_url', 'website', 'company_size', 'industry', 'location',
            'payment_status', 'subscription_valid_until', 'verified',
            'is_subscription_valid', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'email', 'full_name', 'payment_status',
            'subscription_valid_until', 'verified', 'is_subscription_valid',
            'created_at', 'updated_at'
        ]


class RecruiterListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing recruiters"""

    email = serializers.EmailField(source='id.email', read_only=True)
    full_name = serializers.CharField(source='id.full_name', read_only=True)

    class Meta:
        model = Recruiter
        fields = [
            'id', 'email', 'full_name', 'company_name', 'industry',
            'location', 'verified', 'payment_status'
        ]


class AdminSerializer(serializers.ModelSerializer):
    """Serializer for Admin profile"""

    user = UserDetailSerializer(source='id', read_only=True)
    email = serializers.EmailField(source='id.email', read_only=True)
    full_name = serializers.CharField(source='id.full_name', read_only=True)

    class Meta:
        model = Admin
        fields = [
            'id', 'user', 'email', 'full_name', 'permissions', 'department',
            'can_manage_users', 'can_manage_jobs', 'can_manage_payments',
            'can_view_analytics', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'email',
                            'full_name', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration with profile creation"""

    # User fields
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=100)
    phone = serializers.CharField(required=False, max_length=20)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    # Candidate-specific fields (optional)
    bio = serializers.CharField(required=False, allow_blank=True)
    skills = serializers.ListField(
        child=serializers.CharField(), required=False)
    experience_years = serializers.IntegerField(required=False, default=0)
    location = serializers.CharField(required=False, allow_blank=True)

    # Recruiter-specific fields (required if role=RECRUITER)
    company_name = serializers.CharField(required=False, max_length=255)
    company_description = serializers.CharField(
        required=False, allow_blank=True)
    industry = serializers.CharField(required=False, max_length=100)

    def validate(self, attrs):
        """Validate passwords match"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        # Validate role-specific required fields
        if attrs['role'] == 'RECRUITER' and not attrs.get('company_name'):
            raise serializers.ValidationError(
                {"company_name": "Company name is required for recruiters."})

        return attrs

    def create(self, validated_data):
        """Create user and associated profile"""
        password_confirm = validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        role = validated_data.get('role')

        # Extract profile-specific data and remove them from validated_data
        candidate_data = {}
        recruiter_data = {}

        # Pop candidate fields if present (safe even if role is different)
        candidate_data['bio'] = validated_data.pop('bio', '')
        candidate_data['skills'] = validated_data.pop('skills', [])
        candidate_data['experience_years'] = validated_data.pop(
            'experience_years', 0)
        candidate_data['location'] = validated_data.pop('location', '')

        # Pop recruiter fields if present
        recruiter_data['company_name'] = validated_data.pop(
            'company_name', None)
        recruiter_data['company_description'] = validated_data.pop(
            'company_description', '')
        recruiter_data['industry'] = validated_data.pop('industry', '')

        # Create user (validated_data now only contains user fields)
        user = User.objects.create_user(password=password, **validated_data)

        # Create associated profile based on role
        if role == 'CANDIDATE':
            Candidate.objects.create(id=user, **candidate_data)
        elif role == 'RECRUITER':
            # company_name is required for recruiters; ensure we pass it
            rc_data = {k: v for k, v in recruiter_data.items()
                       if v is not None}
            Recruiter.objects.create(id=user, **rc_data)
        elif role == 'ADMIN':
            Admin.objects.create(id=user)

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for login payload validation"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        if not email or not password:
            raise serializers.ValidationError({
                'detail': 'Both email and password are required.'
            })

        # Importing here to avoid circular imports at module import time
        from django.contrib.auth import authenticate

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError({
                'detail': 'Invalid credentials.'
            })

        attrs['user'] = user
        return attrs


class LogoutSerializer(serializers.Serializer):
    """Serializer for logout payload (expects refresh token)"""
    refresh = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        # Nothing special to validate here besides presence
        return attrs
