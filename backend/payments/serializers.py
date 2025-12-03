"""
Serializers for Payments app
"""

from rest_framework import serializers
from .models import Payment
from users.serializers import RecruiterListSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    
    recruiter_info = RecruiterListSerializer(source='recruiter', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'recruiter', 'recruiter_info', 'amount', 'currency', 'method',
            'status', 'transaction_id', 'external_reference', 'payment_proof_url',
            'notes', 'created_at', 'paid_at', 'valid_until', 'refunded_at',
            'refund_reason'
        ]
        read_only_fields = [
            'id', 'recruiter_info', 'transaction_id', 'created_at',
            'paid_at', 'valid_until', 'refunded_at'
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""
    
    class Meta:
        model = Payment
        fields = ['amount', 'currency', 'method', 'payment_proof_url', 'notes']
    
    def create(self, validated_data):
        """Create payment with recruiter from request"""
        recruiter = self.context['request'].user.recruiter_profile
        validated_data['recruiter'] = recruiter
        return super().create(validated_data)


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing payments"""
    
    company_name = serializers.CharField(source='recruiter.company_name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'company_name', 'amount', 'currency', 'method',
            'status', 'created_at', 'paid_at', 'valid_until'
        ]
