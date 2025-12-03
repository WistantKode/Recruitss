"""
Custom permission classes for role-based access control
"""

from rest_framework import permissions


class IsCandidate(permissions.BasePermission):
    """
    Permission class for Candidate users
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'CANDIDATE' and
            hasattr(request.user, 'candidate_profile')
        )


class IsRecruiter(permissions.BasePermission):
    """
    Permission class for Recruiter users
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'RECRUITER' and
            hasattr(request.user, 'recruiter_profile')
        )


class IsAdmin(permissions.BasePermission):
    """
    Permission class for Admin users
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN' and
            hasattr(request.user, 'admin_profile')
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        # Check different ownership patterns
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'candidate') and hasattr(request.user, 'candidate_profile'):
            return obj.candidate == request.user.candidate_profile
        elif hasattr(obj, 'recruiter') and hasattr(request.user, 'recruiter_profile'):
            return obj.recruiter == request.user.recruiter_profile
        
        return obj == request.user


class IsCandidateOwner(permissions.BasePermission):
    """
    Permission to only allow candidate to access their own data
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        if hasattr(request.user, 'candidate_profile'):
            return obj.candidate == request.user.candidate_profile
        
        return False


class IsRecruiterOwner(permissions.BasePermission):
    """
    Permission to only allow recruiter to access their own data
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        if hasattr(request.user, 'recruiter_profile'):
            # For job offers
            if hasattr(obj, 'recruiter'):
                return obj.recruiter == request.user.recruiter_profile
            # For applications through job offers
            elif hasattr(obj, 'job_offer'):
                return obj.job_offer.recruiter == request.user.recruiter_profile
        
        return False


class IsActiveRecruiter(permissions.BasePermission):
    """
    Permission class for recruiters with active subscription
    """
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.role != 'RECRUITER':
            return False
        
        if not hasattr(request.user, 'recruiter_profile'):
            return False
        
        recruiter = request.user.recruiter_profile
        
        # Allow read operations
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For write operations, check subscription
        return recruiter.payment_status == 'ACTIVE' and recruiter.is_subscription_valid


class CanManageUsers(permissions.BasePermission):
    """
    Permission for admins who can manage users
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN' and
            hasattr(request.user, 'admin_profile') and
            request.user.admin_profile.can_manage_users
        )


class CanManageJobs(permissions.BasePermission):
    """
    Permission for admins who can manage jobs
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN' and
            hasattr(request.user, 'admin_profile') and
            request.user.admin_profile.can_manage_jobs
        )


class CanManagePayments(permissions.BasePermission):
    """
    Permission for admins who can manage payments
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN' and
            hasattr(request.user, 'admin_profile') and
            request.user.admin_profile.can_manage_payments
        )
