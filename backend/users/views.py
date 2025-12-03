"""
API Views for Users app
Includes authentication and user management endpoints
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import authenticate
from django.utils import timezone

from .models import User, Candidate, Recruiter, Admin
from .serializers import (
    UserSerializer, UserDetailSerializer, UserRegistrationSerializer,
    CandidateSerializer, CandidateListSerializer,
    RecruiterSerializer, RecruiterListSerializer,
    AdminSerializer, LoginSerializer, LogoutSerializer
)
from .permissions import IsCandidate, IsRecruiter, IsAdmin


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint
    Creates user with associated profile based on role
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserDetailSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """
    User login endpoint
    Returns JWT tokens on successful authentication
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if getattr(user, 'status', 'ACTIVE') != 'ACTIVE':
            return Response({
                'error': f"Account is {getattr(user, 'status', 'inactive').lower()}. Please contact support."
            }, status=status.HTTP_403_FORBIDDEN)

        # Update last login if field exists
        if hasattr(user, 'last_login_at'):
            user.last_login_at = timezone.now()
            user.save(update_fields=['last_login_at'])

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserDetailSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """
    User logout endpoint
    Blacklists the refresh token
    """
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data['refresh']
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    Provides CRUD operations for users
    """
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user role"""
        user = self.request.user
        if user.role == 'ADMIN':
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CandidateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Candidate model
    Provides CRUD operations for candidate profiles
    """
    queryset = Candidate.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return CandidateListSerializer
        return CandidateSerializer

    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        if user.role == 'ADMIN':
            return Candidate.objects.all()
        elif user.role == 'CANDIDATE':
            return Candidate.objects.filter(id=user)
        elif user.role == 'RECRUITER':
            # Recruiters can view all candidates
            return Candidate.objects.all()
        return Candidate.objects.none()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current candidate profile"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(request.user.candidate_profile)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current candidate profile"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can update their profile'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(
            request.user.candidate_profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def upload_cv(self, request):
        """Upload CV for candidate"""
        if request.user.role != 'CANDIDATE':
            return Response({
                'error': 'Only candidates can upload CV'
            }, status=status.HTTP_403_FORBIDDEN)

        # TODO: Implement file upload logic
        # This would typically upload to S3 or similar storage
        return Response({
            'message': 'CV upload endpoint - to be implemented with storage service'
        }, status=status.HTTP_501_NOT_IMPLEMENTED)


class RecruiterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Recruiter model
    Provides CRUD operations for recruiter profiles
    """
    queryset = Recruiter.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return RecruiterListSerializer
        return RecruiterSerializer

    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        if user.role == 'ADMIN':
            return Recruiter.objects.all()
        elif user.role == 'RECRUITER':
            return Recruiter.objects.filter(id=user)
        return Recruiter.objects.none()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current recruiter profile"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(request.user.recruiter_profile)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current recruiter profile"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can update their profile'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(
            request.user.recruiter_profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Admin model
    Provides CRUD operations for admin profiles
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        """Only admins can view admin profiles"""
        if self.request.user.role == 'ADMIN':
            return Admin.objects.all()
        return Admin.objects.none()
