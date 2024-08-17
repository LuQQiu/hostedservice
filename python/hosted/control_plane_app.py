from fastapi import FastAPI
from .launch_data_plane import create_database_instance

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Control Plane is running"}

@app.post("/create_database")
async def create_database():
    instance_id, instance_ip = await create_database_instance()
    return {
        "message": "Database instance created",
        "instance_id": instance_id,
        "instance_ip": instance_ip
    }
