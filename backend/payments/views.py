"""
API Views for Payments app
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .serializers import (
    PaymentSerializer, PaymentListSerializer, PaymentCreateSerializer
)
from users.permissions import IsRecruiter, IsAdmin


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment model
    Handles subscription payments
    """
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        elif self.action == 'list':
            return PaymentListSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        
        if user.role == 'ADMIN':
            return Payment.objects.all()
        elif user.role == 'RECRUITER':
            return Payment.objects.filter(recruiter=user.recruiter_profile)
        
        return Payment.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Create payment (recruiters only)"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can create payments'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        
        # TODO: Integrate with payment gateway
        # TODO: Send notification to admin for manual payments
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        """Verify and mark payment as completed (admins only)"""
        payment = self.get_object()
        
        if payment.status != 'PENDING':
            return Response({
                'error': f'Payment is already {payment.status.lower()}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        transaction_id = request.data.get('transaction_id')
        payment.mark_as_paid(transaction_id=transaction_id)
        
        # TODO: Send confirmation notification to recruiter
        
        return Response({
            'message': 'Payment verified successfully',
            'payment': PaymentSerializer(payment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject payment (admins only)"""
        payment = self.get_object()
        
        if payment.status != 'PENDING':
            return Response({
                'error': f'Payment is already {payment.status.lower()}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        error_message = request.data.get('reason', 'Payment rejected')
        payment.mark_as_failed(error_message=error_message)
        
        # TODO: Send notification to recruiter
        
        return Response({
            'message': 'Payment rejected',
            'payment': PaymentSerializer(payment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def refund(self, request, pk=None):
        """Refund payment (admins only)"""
        payment = self.get_object()
        
        if payment.status != 'COMPLETED':
            return Response({
                'error': 'Only completed payments can be refunded'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reason = request.data.get('reason', '')
        payment.refund(reason=reason)
        
        # TODO: Process actual refund with payment gateway
        # TODO: Send notification to recruiter
        
        return Response({
            'message': 'Payment refunded successfully',
            'payment': PaymentSerializer(payment).data
        })
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Get payments for current recruiter"""
        if request.user.role != 'RECRUITER':
            return Response({
                'error': 'Only recruiters can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        payments = Payment.objects.filter(recruiter=request.user.recruiter_profile)
        page = self.paginate_queryset(payments)
        
        if page is not None:
            serializer = PaymentListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
