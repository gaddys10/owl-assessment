from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dashboard_data import DASHBOARD_DATA

app = FastAPI(
    title="OWL Dashboard API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "OWL Dashboard API is running",
    }


@app.get("/api/dashboard")
def get_dashboard():
    return DASHBOARD_DATA