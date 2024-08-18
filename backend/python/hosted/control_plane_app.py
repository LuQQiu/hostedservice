from fastapi import FastAPI, HTTPException
from .data_plane_instance import create_database_instance, delete_database_instance

app = FastAPI()

# Dictionary to store the mapping of database path to instance ID
database_map = {}

@app.get("/")
async def root():
    return {"message": "Control Plane is running"}

@app.post("/create_database")
async def create_database(database_path: str):
    if database_path in database_map:
        raise HTTPException(status_code=400, detail="Database already exists at this path")
    
    instance_id, instance_ip = await create_database_instance(database_path)
    database_map[database_path] = instance_id

    return {
        "message": "Database instance created",
        "instance_id": instance_id,
        "instance_ip": instance_ip,
        "database_path": database_path
    }

@app.delete("/delete_database")
async def delete_database(database_path: str):
    if database_path not in database_map:
        raise HTTPException(status_code=404, detail="Database not found at this path")
    
    # Get the instance ID
    instance_id = database_map[database_path]

    await delete_database_instance(instance_id)
    del database_map[database_path]
    return {"message": "Database instance deleted"}

@app.get("/list_databases")
async def list_databases():
    return {"databases": [{"path": path, "instance_id": instance_id} for path, instance_id in database_map.items()]}
