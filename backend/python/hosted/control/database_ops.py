from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from hosted.common.auth import User, get_current_user
from hosted.data.data_plane_instance import create_database_instance, delete_database_instance
from pydantic import BaseModel
import logging
import asyncio

logger = logging.getLogger(__name__)

db_router = APIRouter()

class Database(BaseModel):
    path: str
    status: str
    instance_id: str = None
    instance_ip: str = None

# Dictionary to store the mapping of database path to Database object
database_map = {}

async def create_database_task(database_path: str):
    try:
        instance_id, instance_ip = await create_database_instance(database_path)
        database_map[database_path].status = "Created"
        database_map[database_path].instance_id = instance_id
        database_map[database_path].instance_ip = instance_ip
    except Exception as e:
        logger.error(f"Error creating database: {str(e)}", exc_info=True)
        database_map[database_path].status = f"Error: {str(e)}"

@db_router.post("/create_database")
async def create_database(database_path: str, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)):
    if database_path in database_map:
        raise HTTPException(status_code=400, detail="Database already exists at this path")
    
    database_map[database_path] = Database(path=database_path, status="In Progress")
    background_tasks.add_task(create_database_task, database_path)

    return {
        "message": "Database creation started",
        "database_path": database_path,
        "status": "In Progress"
    }

@db_router.delete("/delete_database")
async def delete_database(database_path: str, current_user: User = Depends(get_current_user)):
    if database_path not in database_map:
        raise HTTPException(status_code=404, detail="Database not found at this path")
    
    database = database_map[database_path]
    if database.status == "In Progress":
        raise HTTPException(status_code=400, detail="Cannot delete a database that is still being created")

    await delete_database_instance(database.instance_id)
    del database_map[database_path]
    return {"message": "Database instance deleted"}

@db_router.get("/list_databases")
async def list_databases(current_user: User = Depends(get_current_user)):
    return {"databases": [db.dict() for db in database_map.values()]}