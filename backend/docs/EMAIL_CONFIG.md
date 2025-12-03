# Email Configuration for Recruitsss

## SMTP Settings

Configure these environment variables in your `.env` file:

```bash
# Email settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@recruitsss.com
```

## Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password
   - Use this password in `EMAIL_HOST_PASSWORD`

## Using SendGrid (Recommended for Production)

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@recruitsss.com
```

## Using Mailgun

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=postmaster@your-domain.mailgun.org
EMAIL_HOST_PASSWORD=your-mailgun-password
DEFAULT_FROM_EMAIL=noreply@recruitsss.com
```

## Testing Locally

For development, use the console backend:

```bash
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

This will print emails to the console instead of sending them.

## Celery Tasks

Email notifications are sent asynchronously via Celery tasks.

Make sure Celery is running:

```bash
# Start Celery worker
celery -A config worker -l info

# Start Celery beat (for periodic tasks)
celery -A config beat -l info
```

## Available Email Templates

1. **application_notification.html** - New application received
2. **system_notification.html** - Welcome email, job published, etc.
3. **interview_notification.html** - Interview scheduled
4. **message_notification.html** - New message received

## Testing Emails

You can test email sending from Django shell:

```python
from core.tasks import send_welcome_email

# Send test email
send_welcome_email.delay('test@example.com', 'John', 'CANDIDATE')
```

Or trigger emails by performing actions:
- Register a new user → Welcome email sent
- Apply to a job → Application email sent to recruiter
- Change application status → Status update email sent to candidate
