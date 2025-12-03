"""
Celery tasks for Recruitsss
Handles async operations like email notifications
"""

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@shared_task
def send_notification_email(user_email, notification_type, context):
    """
    Send notification email to user
    
    Args:
        user_email: Recipient email
        notification_type: Type of notification (APPLICATION, INTERVIEW, etc.)
        context: Dict with notification details
    """
    
    # Email templates based on notification type
    templates = {
        'APPLICATION': 'emails/application_notification.html',
        'INTERVIEW': 'emails/interview_notification.html',
        'MESSAGE': 'emails/message_notification.html',
        'SYSTEM': 'emails/system_notification.html',
    }
    
    template = templates.get(notification_type, 'emails/default_notification.html')
    
    # Render HTML email
    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    
    subject = context.get('subject', 'Nouvelle notification - Recruitsss')
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return f"Email sent to {user_email}"
    except Exception as e:
        return f"Failed to send email: {str(e)}"


@shared_task
def send_application_received_email(recruiter_email, candidate_name, job_title):
    """Send email to recruiter when new application is received"""
    
    context = {
        'subject': f'Nouvelle candidature pour {job_title}',
        'candidate_name': candidate_name,
        'job_title': job_title,
    }
    
    return send_notification_email(recruiter_email, 'APPLICATION', context)


@shared_task
def send_application_status_email(candidate_email, job_title, status):
    """Send email to candidate when application status changes"""
    
    status_messages = {
        'SHORTLISTED': 'Votre candidature a été présélectionnée',
        'INTERVIEW_SCHEDULED': 'Un entretien a été programmé',
        'ACCEPTED': 'Félicitations! Votre candidature a été acceptée',
        'REJECTED': 'Votre candidature n\'a pas été retenue cette fois',
    }
    
    context = {
        'subject': status_messages.get(status, 'Mise à jour de votre candidature'),
        'job_title': job_title,
        'status': status,
        'status_message': status_messages.get(status, ''),
    }
    
    return send_notification_email(candidate_email, 'APPLICATION', context)


@shared_task
def send_welcome_email(user_email, first_name, role):
    """Send welcome email to new user"""
    
    context = {
        'subject': 'Bienvenue sur Recruitsss!',
        'first_name': first_name,
        'role': role,
    }
    
    return send_notification_email(user_email, 'SYSTEM', context)


@shared_task
def send_job_published_email(recruiter_email, job_title):
    """Send confirmation when job is published"""
    
    context = {
        'subject': f'Votre offre "{job_title}" est maintenant publiée',
        'job_title': job_title,
    }
    
    return send_notification_email(recruiter_email, 'SYSTEM', context)


@shared_task
def send_bulk_notification_emails(user_emails, notification_type, context):
    """Send notification to multiple users"""
    
    results = []
    for email in user_emails:
        result = send_notification_email(email, notification_type, context)
        results.append(result)
    
    return f"Sent {len(results)} emails"
