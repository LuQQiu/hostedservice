from fastapi import APIRouter, Depends, HTTPException
from hosted.common.auth import User, get_current_user
from hosted.data.data_plane_instance import create_database_instance, delete_database_instance

db_router = APIRouter()

# Dictionary to store the mapping of database path to instance ID
database_map = {}

@db_router.post("/create_database")
async def create_database(database_path: str, current_user: User = Depends(get_current_user)):
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

@db_router.delete("/delete_database")
async def delete_database(database_path: str, current_user: User = Depends(get_current_user)):
    if database_path not in database_map:
        raise HTTPException(status_code=404, detail="Database not found at this path")
    
    # Get the instance ID
    instance_id = database_map[database_path]

    await delete_database_instance(instance_id)
    del database_map[database_path]
    return {"message": "Database instance deleted"}

@db_router.get("/list_databases")
async def list_databases(current_user: User = Depends(get_current_user)):
    return {"databases": [{"path": path, "instance_id": instance_id} for path, instance_id in database_map.items()]}
