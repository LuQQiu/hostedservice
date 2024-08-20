from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hosted.common.auth import auth_router
from .database_ops import db_router
import os

logger = logging.getLogger(__name__)

app = FastAPI()

public_dns_name = os.environ.get('PUBLIC_DNS_NAME', 'localhost')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        f"http://{public_dns_name}:5173",
        f"http://{public_dns_name}"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(db_router)

@app.get("/")
async def root():
    return {"message": "Control Plane is running"}