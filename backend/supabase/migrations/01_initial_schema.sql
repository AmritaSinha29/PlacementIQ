-- Migration: 01_initial_schema
-- Created based on PlacementIQ PRD Section 9: Data Model

-- 1. Institute
CREATE TABLE IF NOT EXISTS institutes (
    institute_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier VARCHAR(50),
    state VARCHAR(100),
    placement_rates JSONB, -- Array of rates e.g. [80.5, 90.0]
    recruiter_ids JSONB,   -- Array of recruiter strings/ids
    salary_benchmarks JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Student
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course VARCHAR(150),
    cgpa_band VARCHAR(50),
    semester INTEGER,
    institute_id UUID REFERENCES institutes(institute_id) ON DELETE SET NULL,
    loan_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LoanAccount
CREATE TABLE IF NOT EXISTS loan_accounts (
    loan_id VARCHAR(100) PRIMARY KEY,
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    disbursed_amount DECIMAL(15, 2),
    emi_amount DECIMAL(15, 2),
    first_emi_date DATE,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PlacementRecord
CREATE TABLE IF NOT EXISTS placement_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    placement_date DATE,
    employer_type VARCHAR(100),
    salary DECIMAL(15, 2),
    job_title VARCHAR(150),
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RiskScore
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    score DECIMAL(5, 2),
    band VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version VARCHAR(50),
    shap_values JSONB
);

-- 6. JobMarketSignal
CREATE TABLE IF NOT EXISTS job_market_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector VARCHAR(100),
    region VARCHAR(100),
    date DATE,
    demand_index DECIMAL(10, 2),
    yoy_change DECIMAL(5, 2),
    source_portal VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Alert
CREATE TABLE IF NOT EXISTS alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    type VARCHAR(100),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_by VARCHAR(100),
    status VARCHAR(50)
);

-- 8. Intervention
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    type VARCHAR(100),
    recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50),
    outcome TEXT,
    assigned_to VARCHAR(100)
);
