from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时自动建表（演示用；生产建议用 Alembic 做迁移）
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Fullstack Auth API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/health")
def health():
    return {"status": "ok"}
