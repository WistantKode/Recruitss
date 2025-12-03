"""
URL Configuration for Jobs app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import JobOfferViewSet, SavedJobViewSet

router = DefaultRouter()
router.register(r'jobs', JobOfferViewSet, basename='job')
router.register(r'saved-jobs', SavedJobViewSet, basename='saved-job')

urlpatterns = [
    path('', include(router.urls)),
]
