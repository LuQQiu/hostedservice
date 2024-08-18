from fastapi import FastAPI
import lancedb
import os

app = FastAPI()
database_path = os.getenv("DATABASE_PATH")
db = lancedb.connect(database_path)

@app.get("/")
async def root():
    return {"message": "Data Plane is running"}

@app.post("/create_table")
async def create_table(table_name: str):
    table = db.create_table(table_name, data=[{"id": 1, "value": "test"}])
    return {"message": f"Table {table_name} created"}

@app.get("/query_table")
async def query_table(table_name: str):
    table = db.open_table(table_name)
    return table.to_pandas().to_dict(orient="records")
