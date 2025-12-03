-- =====================================================
-- SCHÉMA DE BASE DE DONNÉES COMPLET
-- Plateforme de Recrutement MVP
-- =====================================================

-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Pour recherche full-text

-- =====================================================
-- TABLE: users (Utilisateurs de base)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('CANDIDATE', 'RECRUITER', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- TABLE: candidates (Profils candidats)
-- =====================================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    skills TEXT[], -- Array de compétences
    experience_years INTEGER DEFAULT 0,
    education VARCHAR(255),
    desired_salary_min DECIMAL(10, 2),
    desired_salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(3) DEFAULT 'XOF',
    available_from DATE,
    location VARCHAR(255),
    cv_url VARCHAR(500),
    cv_filename VARCHAR(255),
    cv_uploaded_at TIMESTAMP,
    profile_picture_url VARCHAR(500),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX idx_candidates_location ON candidates(location);
CREATE INDEX idx_candidates_available ON candidates(is_available);

-- =====================================================
-- TABLE: recruiters (Profils recruteurs)
-- =====================================================
CREATE TABLE recruiters (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_description TEXT,
    company_logo_url VARCHAR(500),
    website VARCHAR(255),
    company_size VARCHAR(50) CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
    industry VARCHAR(100),
    location VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'SUSPENDED')),
    subscription_valid_until DATE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recruiters_company_name ON recruiters(company_name);
CREATE INDEX idx_recruiters_payment_status ON recruiters(payment_status);
CREATE INDEX idx_recruiters_industry ON recruiters(industry);

-- =====================================================
-- TABLE: admins (Profils administrateurs)
-- =====================================================
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[], -- Array de permissions
    department VARCHAR(100),
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_manage_jobs BOOLEAN DEFAULT FALSE,
    can_manage_payments BOOLEAN DEFAULT FALSE,
    can_view_analytics BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: job_offers (Offres d'emploi)
-- =====================================================
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(3) DEFAULT 'XOF',
    salary_period VARCHAR(20) CHECK (salary_period IN ('HOURLY', 'MONTHLY', 'YEARLY')),
    contract_type VARCHAR(50) NOT NULL CHECK (contract_type IN ('CDI', 'CDD', 'FREELANCE', 'INTERNSHIP', 'APPRENTICESHIP')),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    skills_required TEXT[], -- Array de compétences requises
    experience_level VARCHAR(50) CHECK (experience_level IN ('JUNIOR', 'INTERMEDIATE', 'SENIOR', 'EXPERT')),
    education_required VARCHAR(255),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'REJECTED')),
    rejection_reason TEXT,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    closed_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_salary_range CHECK (salary_min <= salary_max),
    CONSTRAINT valid_publication_dates CHECK (published_at < expires_at)
);

CREATE INDEX idx_job_offers_recruiter ON job_offers(recruiter_id);
CREATE INDEX idx_job_offers_status ON job_offers(status);
CREATE INDEX idx_job_offers_location ON job_offers(location);
CREATE INDEX idx_job_offers_contract_type ON job_offers(contract_type);
CREATE INDEX idx_job_offers_skills ON job_offers USING GIN(skills_required);
CREATE INDEX idx_job_offers_published_at ON job_offers(published_at);
CREATE INDEX idx_job_offers_title_trgm ON job_offers USING gin(title gin_trgm_ops);

-- =====================================================
-- TABLE: applications (Candidatures)
-- =====================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'VIEWED', 'SHORTLISTED', 
        'INTERVIEW_SCHEDULED', 'REJECTED', 'ACCEPTED', 'WITHDRAWN'
    )),
    match_score DECIMAL(3, 2) CHECK (match_score BETWEEN 0 AND 1), -- Score IA 0-1
    recruiter_notes TEXT,
    interview_date TIMESTAMP,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP,
    responded_at TIMESTAMP,
    UNIQUE(candidate_id, job_offer_id) -- Un candidat ne peut postuler qu'une fois
);

CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_job_offer ON applications(job_offer_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_match_score ON applications(match_score DESC);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- =====================================================
-- TABLE: notifications (Notifications)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'ACCOUNT_CREATED', 'APPLICATION_SUBMITTED', 
        'APPLICATION_STATUS_CHANGED', 'NEW_MESSAGE', 
        'JOB_MATCH', 'PASSWORD_RESET', 'PAYMENT_REMINDER'
    )),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'IN_APP')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Données additionnelles en JSON
    read BOOLEAN DEFAULT FALSE,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- TABLE: payments (Paiements)
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    method VARCHAR(50) CHECK (method IN ('MANUAL', 'MOBILE_MONEY', 'STRIPE', 'WHATSAPP_BUSINESS')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    transaction_id VARCHAR(255),
    external_reference VARCHAR(255), -- Référence externe (Stripe, MoMo, etc.)
    payment_proof_url VARCHAR(500), -- URL preuve de paiement manuel
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    valid_until DATE, -- Date d'expiration de l'accès payé
    refunded_at TIMESTAMP,
    refund_reason TEXT
);

CREATE INDEX idx_payments_recruiter ON payments(recruiter_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- =====================================================
-- TABLE: contact_messages (Messages de contact)
-- =====================================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED')),
    assigned_to UUID REFERENCES admins(id) ON DELETE SET NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_assigned_to ON contact_messages(assigned_to);

-- =====================================================
-- TABLE: logs (Logs système)
-- =====================================================
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'USER', 'JOB_OFFER', 'APPLICATION', etc.
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_entity ON logs(entity_type, entity_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);

-- =====================================================
-- TABLE: seo_metadata (Métadonnées SEO)
-- =====================================================
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    keywords TEXT[],
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url VARCHAR(500),
    canonical_url VARCHAR(500),
    robots VARCHAR(50) DEFAULT 'index,follow',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: badges (Badges gamification)
-- =====================================================
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    criteria JSONB NOT NULL, -- Critères d'obtention
    points INTEGER DEFAULT 0,
    rarity VARCHAR(20) CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: candidate_badges (Badges des candidats)
-- =====================================================
CREATE TABLE candidate_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, badge_id)
);

CREATE INDEX idx_candidate_badges_candidate ON candidate_badges(candidate_id);
CREATE INDEX idx_candidate_badges_badge ON candidate_badges(badge_id);

-- =====================================================
-- TABLE: gamification_scores (Scores de gamification)
-- =====================================================
CREATE TABLE gamification_scores (
    candidate_id UUID PRIMARY KEY REFERENCES candidates(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    profile_completion_points INTEGER DEFAULT 0,
    application_points INTEGER DEFAULT 0,
    engagement_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: saved_jobs (Offres sauvegardées par candidats)
-- =====================================================
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, job_offer_id)
);

CREATE INDEX idx_saved_jobs_candidate ON saved_jobs(candidate_id);
CREATE INDEX idx_saved_jobs_job_offer ON saved_jobs(job_offer_id);

-- =====================================================
-- TRIGGERS pour mise à jour automatique
-- =====================================================

-- Fonction générique de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application du trigger sur toutes les tables concernées
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_offers_updated_at BEFORE UPDATE ON job_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Trigger pour incrémenter le compteur de candidatures
-- =====================================================
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE job_offers 
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_offer_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_applications 
AFTER INSERT ON applications
FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- =====================================================
-- Trigger pour calculer la complétude du profil candidat
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
    completeness INTEGER := 0;
BEGIN
    -- Bio (10 points)
    IF NEW.bio IS NOT NULL AND LENGTH(NEW.bio) > 50 THEN
        completeness := completeness + 10;
    END IF;
    
    -- Compétences (15 points)
    IF NEW.skills IS NOT NULL AND array_length(NEW.skills, 1) >= 3 THEN
        completeness := completeness + 15;
    END IF;
    
    -- Expérience (10 points)
    IF NEW.experience_years IS NOT NULL AND NEW.experience_years > 0 THEN
        completeness := completeness + 10;
    END IF;
    
    -- Éducation (10 points)
    IF NEW.education IS NOT NULL THEN
        completeness := completeness + 10;
    END IF;
    
    -- CV (25 points)
    IF NEW.cv_url IS NOT NULL THEN
        completeness := completeness + 25;
    END IF;
    
    -- Photo de profil (10 points)
    IF NEW.profile_picture_url IS NOT NULL THEN
        completeness := completeness + 10;
    END IF;
    
    -- Localisation (5 points)
    IF NEW.location IS NOT NULL THEN
        completeness := completeness + 5;
    END IF;
    
    -- Salaire désiré (5 points)
    IF NEW.desired_salary_min IS NOT NULL THEN
        completeness := completeness + 5;
    END IF;
    
    -- LinkedIn (5 points)
    IF NEW.linkedin_url IS NOT NULL THEN
        completeness := completeness + 5;
    END IF;
    
    -- Portfolio (5 points)
    IF NEW.portfolio_url IS NOT NULL THEN
        completeness := completeness + 5;
    END IF;
    
    NEW.profile_completeness := completeness;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_profile_completeness
BEFORE INSERT OR UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION calculate_profile_completeness();

-- =====================================================
-- VUES utiles
-- =====================================================

-- Vue: Statistiques des recruteurs
CREATE OR REPLACE VIEW recruiter_statistics AS
SELECT 
    r.id,
    r.company_name,
    COUNT(DISTINCT jo.id) as total_jobs,
    COUNT(DISTINCT CASE WHEN jo.status = 'PUBLISHED' THEN jo.id END) as active_jobs,
    COUNT(DISTINCT a.id) as total_applications,
    COUNT(DISTINCT a.candidate_id) as unique_applicants,
    AVG(jo.views_count) as avg_job_views,
    r.payment_status,
    r.subscription_valid_until
FROM recruiters r
LEFT JOIN job_offers jo ON r.id = jo.recruiter_id
LEFT JOIN applications a ON jo.id = a.job_offer_id
GROUP BY r.id, r.company_name, r.payment_status, r.subscription_valid_until;

-- Vue: Statistiques des candidats
CREATE OR REPLACE VIEW candidate_statistics AS
SELECT 
    c.id,
    u.first_name,
    u.last_name,
    c.profile_completeness,
    COUNT(DISTINCT a.id) as total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'SHORTLISTED' THEN a.id END) as shortlisted,
    COUNT(DISTINCT CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN a.id END) as interviews,
    COUNT(DISTINCT CASE WHEN a.status = 'ACCEPTED' THEN a.id END) as accepted,
    AVG(a.match_score) as avg_match_score,
    c.is_available
FROM candidates c
JOIN users u ON c.id = u.id
LEFT JOIN applications a ON c.id = a.candidate_id
GROUP BY c.id, u.first_name, u.last_name, c.profile_completeness, c.is_available;

-- Vue: Offres actives avec statistiques
CREATE OR REPLACE VIEW active_jobs_with_stats AS
SELECT 
    jo.id,
    jo.title,
    r.company_name,
    jo.location,
    jo.contract_type,
    jo.salary_min,
    jo.salary_max,
    jo.salary_currency,
    jo.views_count,
    jo.applications_count,
    jo.published_at,
    jo.expires_at,
    EXTRACT(DAY FROM (jo.expires_at - CURRENT_TIMESTAMP)) as days_remaining
FROM job_offers jo
JOIN recruiters r ON jo.recruiter_id = r.id
WHERE jo.status = 'PUBLISHED' 
  AND jo.expires_at > CURRENT_TIMESTAMP
ORDER BY jo.published_at DESC;

-- =====================================================
-- DONNÉES DE TEST (Optionnel pour développement)
-- =====================================================