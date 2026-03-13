from fastapi import FastAPI
from backend.routes import router

app = FastAPI(title="SnapCart AI")

app.include_router(router)


@app.get("/")
def home():
    return {"message": "SnapCart backend running"}