from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from uuid import UUID

# 1. Institute
class InstituteBase(BaseModel):
    tier: Optional[str] = None
    state: Optional[str] = None
    placement_rates: Optional[List[float]] = None
    recruiter_ids: Optional[List[str]] = None
    salary_benchmarks: Optional[Dict[str, float]] = None

class InstituteCreate(InstituteBase):
    pass

class InstituteResponse(InstituteBase):
    institute_id: UUID
    created_at: datetime

# 2. Student
class StudentBase(BaseModel):
    course: Optional[str] = None
    cgpa_band: Optional[str] = None
    semester: Optional[int] = None
    institute_id: Optional[UUID] = None
    loan_id: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    student_id: UUID
    created_at: datetime

# 3. LoanAccount
class LoanAccountBase(BaseModel):
    loan_id: str
    student_id: UUID
    disbursed_amount: Optional[float] = None
    emi_amount: Optional[float] = None
    first_emi_date: Optional[date] = None
    status: Optional[str] = None

class LoanAccountResponse(LoanAccountBase):
    created_at: datetime

# 4. PlacementRecord
class PlacementRecordBase(BaseModel):
    student_id: UUID
    placement_date: Optional[date] = None
    employer_type: Optional[str] = None
    salary: Optional[float] = None
    job_title: Optional[str] = None
    source: Optional[str] = None

class PlacementRecordResponse(PlacementRecordBase):
    id: UUID
    created_at: datetime

# 5. RiskScore
class RiskScoreBase(BaseModel):
    student_id: UUID
    score: float
    band: str
    model_version: str
    shap_values: Optional[Dict[str, Any]] = None

class RiskScoreResponse(RiskScoreBase):
    id: UUID
    timestamp: datetime

# 6. JobMarketSignal
class JobMarketSignalBase(BaseModel):
    sector: str
    region: str
    date: date
    demand_index: float
    yoy_change: float
    source_portal: str

class JobMarketSignalResponse(JobMarketSignalBase):
    id: UUID
    created_at: datetime

# 7. Alert
class AlertBase(BaseModel):
    student_id: UUID
    type: str
    acknowledged_by: Optional[str] = None
    status: str

class AlertResponse(AlertBase):
    alert_id: UUID
    triggered_at: datetime

# 8. Intervention
class InterventionBase(BaseModel):
    student_id: UUID
    type: str
    status: str
    outcome: Optional[str] = None
    assigned_to: Optional[str] = None

class InterventionResponse(InterventionBase):
    id: UUID
    recommended_at: datetime
