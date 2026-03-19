from fastapi import FastAPI
from backend.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SnapCart AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.get("/")
def home():
    return {"message": "SnapCart backend running"}