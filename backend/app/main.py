from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import router as v1_router
import os

app = FastAPI(
    title="PlacementIQ API",
    description="Backend API for the PlacementIQ AI-Powered Risk Modeling System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the PlacementIQ API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

# Include API v1 router
app.include_router(v1_router, prefix="/v1", tags=["v1"])

