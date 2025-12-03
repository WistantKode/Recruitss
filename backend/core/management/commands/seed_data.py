"""
Management command to populate the database with realistic demo data
Perfect for presentations and testing
"""

import random
from datetime import timedelta, datetime
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from users.models import User, Candidate, Recruiter, Admin
from jobs.models import JobOffer, SavedJob
from applications.models import Application
from payments.models import Payment
from notifications.models import Notification


class Command(BaseCommand):
    help = 'Populates the database with realistic demo data for presentations'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )
        parser.add_argument(
            '--candidates',
            type=int,
            default=20,
            help='Number of candidates to create (default: 20)',
        )
        parser.add_argument(
            '--recruiters',
            type=int,
            default=10,
            help='Number of recruiters to create (default: 10)',
        )
        parser.add_argument(
            '--jobs',
            type=int,
            default=30,
            help='Number of job offers to create (default: 30)',
        )

    def handle(self, *args, **options):
        try:
            # Import Faker here to check if it's installed
            from faker import Faker
            fake = Faker(['fr_FR', 'en_US'])  # French and English for variety
        except ImportError:
            self.stdout.write(
                self.style.ERROR(
                    'Faker is not installed. Please run: pip install Faker'
                )
            )
            return

        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            with transaction.atomic():
                Notification.objects.all().delete()
                Application.objects.all().delete()
                SavedJob.objects.all().delete()
                Payment.objects.all().delete()
                JobOffer.objects.all().delete()
                Candidate.objects.all().delete()
                Recruiter.objects.all().delete()
                Admin.objects.all().delete()
                User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS('✓ Data cleared'))

        self.stdout.write(self.style.SUCCESS('Starting data seeding...'))

        with transaction.atomic():
            # Create admin user
            admin_user = self._create_admin(fake)
            self.stdout.write(self.style.SUCCESS(f'✓ Created admin: {admin_user.email}'))

            # Create candidates
            candidates = []
            for i in range(options['candidates']):
                candidate = self._create_candidate(fake)
                candidates.append(candidate)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(candidates)} candidates')
            )

            # Create recruiters with companies
            recruiters = []
            for i in range(options['recruiters']):
                recruiter = self._create_recruiter(fake)
                recruiters.append(recruiter)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(recruiters)} recruiters')
            )

            # Create job offers
            jobs = []
            for i in range(options['jobs']):
                recruiter = random.choice(recruiters)
                job = self._create_job_offer(fake, recruiter)
                jobs.append(job)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(jobs)} job offers')
            )

            # Create applications
            applications = self._create_applications(fake, candidates, jobs)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(applications)} applications')
            )

            # Create saved jobs
            saved_jobs = self._create_saved_jobs(candidates, jobs)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(saved_jobs)} saved jobs')
            )

            # Create payments
            payments = self._create_payments(fake, recruiters)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(payments)} payments')
            )

            # Create notifications
            all_users = [c.id for c in candidates] + [r.id for r in recruiters]
            notifications = self._create_notifications(fake, all_users)
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created {len(notifications)} notifications')
            )

        self.stdout.write(
            self.style.SUCCESS('\n🎉 Database seeded successfully!')
        )
        self.stdout.write(self.style.SUCCESS(f'\nAdmin credentials:'))
        self.stdout.write(f'  Email: admin@recruitsss.com')
        self.stdout.write(f'  Password: Admin123!')
        self.stdout.write(
            self.style.SUCCESS(f'\nSample candidate credentials:')
        )
        self.stdout.write(f'  Email: candidate1@example.com')
        self.stdout.write(f'  Password: Password123!')
        self.stdout.write(
            self.style.SUCCESS(f'\nSample recruiter credentials:')
        )
        self.stdout.write(f'  Email: recruiter1@example.com')
        self.stdout.write(f'  Password: Password123!')

    def _create_admin(self, fake):
        """Create admin user"""
        user = User.objects.create_user(
            email='admin@recruitsss.com',
            password='Admin123!',
            first_name='Admin',
            last_name='System',
            role='ADMIN',
            status='ACTIVE',
            email_verified=True,
            is_staff=True,
            is_superuser=True,
        )
        Admin.objects.create(
            id=user,
            permissions=['manage_users', 'manage_jobs', 'manage_payments'],
            department='Administration',
            can_manage_users=True,
            can_manage_jobs=True,
            can_manage_payments=True,
            can_view_analytics=True,
        )
        return user

    def _create_candidate(self, fake):
        """Create a candidate with complete profile"""
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}{random.randint(1, 999)}@example.com"

        user = User.objects.create_user(
            email=email,
            password='Password123!',
            first_name=first_name,
            last_name=last_name,
            phone=fake.phone_number()[:20],
            role='CANDIDATE',
            status='ACTIVE',
            email_verified=True,
        )

        skills_pool = [
            'Python', 'JavaScript', 'Java', 'React', 'Django', 'Node.js',
            'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure',
            'Git', 'CI/CD', 'Agile', 'Scrum', 'TypeScript', 'Vue.js',
            'Angular', 'Spring Boot', 'PostgreSQL', 'Redis', 'GraphQL',
            'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma',
            'Project Management', 'Communication', 'Leadership', 'Problem Solving'
        ]

        candidate = Candidate.objects.create(
            id=user,
            bio=fake.text(max_nb_chars=300),
            skills=random.sample(skills_pool, random.randint(3, 8)),
            experience_years=random.randint(0, 15),
            education=random.choice([
                'Licence en Informatique',
                'Master en Génie Logiciel',
                'Ingénieur en Informatique',
                'Master en Data Science',
                'Licence en Gestion',
                'MBA',
                'Doctorat en IA',
            ]),
            desired_salary_min=Decimal(random.randint(300000, 800000)),
            desired_salary_max=Decimal(random.randint(900000, 2000000)),
            salary_currency='XOF',
            available_from=timezone.now().date() + timedelta(days=random.randint(0, 90)),
            location=random.choice([
                'Dakar, Sénégal',
                'Abidjan, Côte d\'Ivoire',
                'Lomé, Togo',
                'Cotonou, Bénin',
                'Paris, France',
                'Bamako, Mali',
                'Ouagadougou, Burkina Faso',
            ]),
            is_available=random.choice([True, True, True, False]),
            cv_url=f'https://storage.example.com/cv/{user.id}.pdf',
            cv_filename=f'CV_{first_name}_{last_name}.pdf',
            cv_uploaded_at=timezone.now() - timedelta(days=random.randint(1, 90)),
            profile_picture_url=fake.image_url(),
            linkedin_url=f'https://linkedin.com/in/{first_name.lower()}-{last_name.lower()}',
            github_url=f'https://github.com/{first_name.lower()}{last_name.lower()}' if random.random() > 0.5 else None,
            portfolio_url=f'https://{first_name.lower()}{last_name.lower()}.dev' if random.random() > 0.6 else None,
        )

        candidate.calculate_profile_completeness()
        candidate.save()

        return candidate

    def _create_recruiter(self, fake):
        """Create a recruiter with company information"""
        first_name = fake.first_name()
        last_name = fake.last_name()
        company_name = fake.company()
        email = f"{first_name.lower()}.{last_name.lower()}@{company_name.lower().replace(' ', '').replace(',', '')[:10]}.com"

        user = User.objects.create_user(
            email=email,
            password='Password123!',
            first_name=first_name,
            last_name=last_name,
            phone=fake.phone_number()[:20],
            role='RECRUITER',
            status='ACTIVE',
            email_verified=True,
        )

        industries = [
            'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
            'Manufacturing', 'Consulting', 'Marketing', 'Telecommunications',
            'E-commerce', 'Logistics', 'Real Estate', 'Media', 'Energy'
        ]

        locations = [
            'Dakar, Sénégal', 'Abidjan, Côte d\'Ivoire', 'Paris, France',
            'Lomé, Togo', 'Cotonou, Bénin', 'Bamako, Mali'
        ]

        # Some recruiters have active subscriptions, others pending
        has_subscription = random.random() > 0.3
        payment_status = 'ACTIVE' if has_subscription else random.choice(['PENDING', 'EXPIRED'])
        
        recruiter = Recruiter.objects.create(
            id=user,
            company_name=company_name,
            company_description=fake.text(max_nb_chars=400),
            company_logo_url=fake.image_url(),
            website=f'https://www.{company_name.lower().replace(" ", "")[:15]}.com',
            company_size=random.choice([
                '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
            ]),
            industry=random.choice(industries),
            location=random.choice(locations),
            payment_status=payment_status,
            subscription_valid_until=(
                timezone.now().date() + timedelta(days=random.randint(1, 90))
                if has_subscription else None
            ),
            verified=has_subscription,
        )

        return recruiter

    def _create_job_offer(self, fake, recruiter):
        """Create a job offer"""
        job_titles = [
            'Développeur Full Stack', 'Développeur Backend Python',
            'Développeur Frontend React', 'Data Scientist',
            'Chef de Projet IT', 'DevOps Engineer', 'UI/UX Designer',
            'Analyste de Données', 'Ingénieur Machine Learning',
            'Architecte Logiciel', 'Développeur Mobile', 'Product Manager',
            'Administrateur Système', 'Ingénieur QA', 'Scrum Master',
            'Business Analyst', 'Consultant IT', 'Développeur Java',
            'Ingénieur Cloud', 'Développeur Node.js'
        ]

        skills_by_title = {
            'Développeur Full Stack': ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
            'Développeur Backend Python': ['Python', 'Django', 'PostgreSQL', 'REST API', 'Docker'],
            'Développeur Frontend React': ['React', 'JavaScript', 'TypeScript', 'CSS', 'Redux'],
            'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL'],
            'Chef de Projet IT': ['Agile', 'Scrum', 'Project Management', 'Communication', 'Leadership'],
            'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
            'UI/UX Designer': ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
        }

        title = random.choice(job_titles)
        skills = skills_by_title.get(title, random.sample([
            'Python', 'JavaScript', 'Java', 'SQL', 'Docker', 'Git', 'Agile'
        ], 3))

        # Job status distribution: more published jobs
        status_choices = ['PUBLISHED'] * 7 + ['DRAFT'] * 2 + ['CLOSED'] * 1
        status = random.choice(status_choices)

        published_at = None
        expires_at = None
        if status == 'PUBLISHED':
            days_ago = random.randint(1, 60)
            published_at = timezone.now() - timedelta(days=days_ago)
            expires_at = published_at + timedelta(days=random.randint(30, 90))
        elif status == 'CLOSED':
            days_ago = random.randint(30, 120)
            published_at = timezone.now() - timedelta(days=days_ago)
            expires_at = published_at + timedelta(days=30)

        job = JobOffer.objects.create(
            recruiter=recruiter,
            title=title,
            description=fake.text(max_nb_chars=800),
            requirements=fake.text(max_nb_chars=400),
            responsibilities=fake.text(max_nb_chars=400),
            salary_min=Decimal(random.randint(400000, 1000000)),
            salary_max=Decimal(random.randint(1200000, 3000000)),
            salary_currency='XOF',
            salary_period=random.choice(['MONTHLY', 'YEARLY']),
            contract_type=random.choice(['CDI', 'CDD', 'FREELANCE', 'INTERNSHIP']),
            location=random.choice([
                'Dakar, Sénégal', 'Abidjan, Côte d\'Ivoire', 'Remote',
                'Paris, France', 'Lomé, Togo', 'Hybride - Dakar'
            ]),
            is_remote=random.choice([True, False, False]),
            skills_required=skills,
            experience_level=random.choice(['JUNIOR', 'INTERMEDIATE', 'SENIOR', 'EXPERT']),
            education_required=random.choice([
                'Licence minimum', 'Master souhaité', 'Bac+3 minimum',
                'Ingénieur ou équivalent', 'Bac+5 requis'
            ]),
            status=status,
            published_at=published_at,
            expires_at=expires_at,
            views_count=random.randint(0, 500) if status == 'PUBLISHED' else 0,
        )

        return job

    def _create_applications(self, fake, candidates, jobs):
        """Create job applications"""
        applications = []
        published_jobs = [job for job in jobs if job.status == 'PUBLISHED']

        # Each candidate applies to 2-5 jobs
        for candidate in candidates:
            num_applications = random.randint(2, min(5, len(published_jobs)))
            selected_jobs = random.sample(published_jobs, num_applications)

            for job in selected_jobs:
                # Skip if already applied
                if Application.objects.filter(candidate=candidate, job_offer=job).exists():
                    continue

                status_weights = {
                    'SUBMITTED': 4,
                    'VIEWED': 3,
                    'SHORTLISTED': 2,
                    'INTERVIEW_SCHEDULED': 1,
                    'REJECTED': 2,
                    'ACCEPTED': 1,
                }
                status = random.choices(
                    list(status_weights.keys()),
                    weights=list(status_weights.values())
                )[0]

                days_ago = random.randint(1, 30)
                applied_at = timezone.now() - timedelta(days=days_ago)

                application = Application.objects.create(
                    candidate=candidate,
                    job_offer=job,
                    cover_letter=fake.text(max_nb_chars=500) if random.random() > 0.3 else None,
                    status=status,
                    match_score=Decimal(random.uniform(0.5, 0.99)).quantize(Decimal('0.01')),
                    applied_at=applied_at,
                    viewed_at=(
                        applied_at + timedelta(days=random.randint(1, 5))
                        if status in ['VIEWED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'ACCEPTED']
                        else None
                    ),
                    responded_at=(
                        applied_at + timedelta(days=random.randint(3, 10))
                        if status in ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'ACCEPTED']
                        else None
                    ),
                    interview_date=(
                        timezone.now() + timedelta(days=random.randint(1, 14))
                        if status == 'INTERVIEW_SCHEDULED'
                        else None
                    ),
                    recruiter_notes=(
                        fake.sentence()
                        if status in ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'ACCEPTED']
                        else None
                    ),
                )
                applications.append(application)

        return applications

    def _create_saved_jobs(self, candidates, jobs):
        """Create saved jobs for candidates"""
        saved_jobs = []
        published_jobs = [job for job in jobs if job.status == 'PUBLISHED']

        for candidate in candidates:
            # Each candidate saves 1-4 jobs
            num_saved = random.randint(1, min(4, len(published_jobs)))
            selected_jobs = random.sample(published_jobs, num_saved)

            for job in selected_jobs:
                # Skip if already saved
                if SavedJob.objects.filter(candidate=candidate, job_offer=job).exists():
                    continue

                saved_job = SavedJob.objects.create(
                    candidate=candidate,
                    job_offer=job,
                )
                saved_jobs.append(saved_job)

        return saved_jobs

    def _create_payments(self, fake, recruiters):
        """Create payment records for recruiters"""
        payments = []

        for recruiter in recruiters:
            # Recruiters with active payment status have 1-3 payments
            if recruiter.payment_status == 'ACTIVE':
                num_payments = random.randint(1, 3)
            else:
                num_payments = random.randint(0, 1)

            for _ in range(num_payments):
                days_ago = random.randint(1, 180)
                created_at = timezone.now() - timedelta(days=days_ago)

                status = 'COMPLETED' if recruiter.payment_status == 'ACTIVE' else random.choice([
                    'PENDING', 'FAILED', 'COMPLETED'
                ])

                payment = Payment.objects.create(
                    recruiter=recruiter,
                    amount=Decimal(random.choice([25000, 50000, 100000, 150000])),
                    currency='XOF',
                    method=random.choice(['MOBILE_MONEY', 'STRIPE', 'MANUAL']),
                    status=status,
                    transaction_id=fake.uuid4() if status == 'COMPLETED' else None,
                    created_at=created_at,
                    paid_at=(
                        created_at + timedelta(hours=random.randint(1, 48))
                        if status == 'COMPLETED'
                        else None
                    ),
                    valid_until=(
                        created_at.date() + timedelta(days=30)
                        if status == 'COMPLETED'
                        else None
                    ),
                    notes=fake.sentence() if random.random() > 0.7 else None,
                )
                payments.append(payment)

        return payments

    def _create_notifications(self, fake, users):
        """Create notifications for users"""
        notifications = []

        notification_types = [
            ('ACCOUNT_CREATED', 'Welcome!', 'Your account has been created successfully.'),
            ('APPLICATION_SUBMITTED', 'Application Submitted', 'Your application has been submitted.'),
            ('APPLICATION_STATUS_CHANGED', 'Application Update', 'Your application status has changed.'),
            ('JOB_MATCH', 'New Job Match', 'We found a job that matches your profile!'),
            ('NEW_MESSAGE', 'New Message', 'You have a new message.'),
        ]

        for user in users:
            # Each user gets 3-8 notifications
            num_notifications = random.randint(3, 8)

            for _ in range(num_notifications):
                notif_type, title, message = random.choice(notification_types)
                days_ago = random.randint(0, 30)

                notification = Notification.objects.create(
                    user=user,
                    type=notif_type,
                    channel=random.choice(['EMAIL', 'IN_APP', 'WHATSAPP']),
                    title=title,
                    message=message,
                    data={
                        'job_id': str(fake.uuid4()) if 'JOB' in notif_type else None,
                        'application_id': str(fake.uuid4()) if 'APPLICATION' in notif_type else None,
                    },
                    read=random.choice([True, False, False]),
                    sent=True,
                    sent_at=timezone.now() - timedelta(days=days_ago),
                    created_at=timezone.now() - timedelta(days=days_ago),
                )
                notifications.append(notification)

        return notifications
