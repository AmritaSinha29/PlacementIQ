# RBI Model Explainability Compliance Report
**Platform**: PlacementIQ
**Domain**: EdFinTech / Loan Risk Modeling
**Target Audience**: Compliance Officers, RBI Auditors, Partner Banks & NBFCs

## 1. Model Overview & Purpose
PlacementIQ utilizes machine learning to predict post-graduation employment timelines and starting salaries. The primary purpose is to identify education loan borrowers who are at high risk of delayed placement, enabling lenders to proactively offer support services (e.g., skill certifications, mock interviews) prior to the first EMI due date.

**Crucial Compliance Note:** PlacementIQ is used *exclusively* for post-disbursement monitoring and student support. It is **not** used to automate credit denial or originations, ensuring compliance with RBI guidelines on automated lending decisions.

## 2. Model Architecture & Transparency
The prediction pipeline avoids opaque "black-box" models (like deep neural networks) in favor of interpretable tree-based architectures:
- **Placement Timeline**: Multi-label classification via XGBoost.
- **Salary Estimation**: Quantile regression via LightGBM.

## 3. Explainability Framework (SHAP)
To satisfy regulatory requirements for algorithmic explainability, PlacementIQ employs **SHapley Additive exPlanations (SHAP)**.
- **Local Interpretability**: Every individual risk score generated is accompanied by exact SHAP values dictating which specific features (e.g., lack of internships, poor macro-economic signals) contributed to the score's deviation from the baseline.
- **Counterfactual Explanations**: The platform explicitly models "What-If" scenarios at the individual level. For example: *"If the borrower completes a Cloud Computing certification, their risk score will decrease by 15 points."*

## 4. Bias, Fairness, and DPDP Act Compliance
- **Data Minimization**: Only academic and professional data relevant to employability are ingested.
- **Exclusion of Protected Attributes**: Models explicitly do **not** use gender, caste, religion, or protected demographic data as features.
- **Fairness Audits**: `Evidently AI` is used in the CI/CD pipeline to conduct stratified testing across geographic regions and institute tiers, ensuring the AUROC gap remains below 5% across diverse cohorts.

## 5. Audit Trails
Every prediction is immutably logged in the `risk_scores` database table alongside the `model_version` and the `shap_values` array that generated it, enabling complete retrospective audits by regulators.
