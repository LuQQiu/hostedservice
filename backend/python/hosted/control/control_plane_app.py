from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hosted.common.auth import auth_router
from .database_ops import db_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(db_router)

@app.get("/")
async def root():
    return {"message": "Control Plane is running"}