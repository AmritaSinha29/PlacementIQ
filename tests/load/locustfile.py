from locust import HttpUser, task, between
import json
import uuid

class PlacementIQLoadTest(HttpUser):
    wait_time = between(1, 5)
    
    def on_start(self):
        # In a real scenario, we'd authenticate here and get a JWT token
        self.headers = {"Authorization": "Bearer test_token", "Content-Type": "application/json"}
        
    @task(3)
    def trigger_scoring(self):
        # Simulates triggering on-demand risk scoring
        student_id = str(uuid.uuid4())
        self.client.post(f"/v1/students/{student_id}/score", headers=self.headers)
        
    @task(5)
    def fetch_risk_profile(self):
        # Simulates a lender loading a student's risk profile (high frequency read)
        student_id = "123e4567-e89b-12d3-a456-426614174000"
        self.client.get(f"/v1/students/{student_id}/risk", headers=self.headers)
        
    @task(2)
    def load_portfolio_overview(self):
        # Simulates loading the main dashboard
        self.client.get("/v1/portfolio/overview", headers=self.headers)

# Run instructions:
# locust -f tests/load/locustfile.py --host=http://localhost:8000
