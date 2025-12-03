"""
URL Configuration for Users app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, LogoutView,
    UserViewSet, CandidateViewSet, RecruiterViewSet, AdminViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'recruiters', RecruiterViewSet, basename='recruiter')
router.register(r'admins', AdminViewSet, basename='admin')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ViewSet routes
    path('', include(router.urls)),
]
