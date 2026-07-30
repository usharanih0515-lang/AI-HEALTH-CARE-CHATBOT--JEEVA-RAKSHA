"""
=============================================================================
Jeeva Raksha — FastAPI ML Service Entry Point (main.py)
=============================================================================
Description : Bootstraps the FastAPI application, registers middleware,
              mounts versioned API routers, and configures lifecycle events.

Run Command :
  Development (with hot-reload):
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  Production:
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

Author      : Jeeva Raksha Dev Team
Version     : 1.0.0
=============================================================================
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router

# ─────────────────────────────────────────────────────────────────────────────
# Setup Logging
# ─────────────────────────────────────────────────────────────────────────────
setup_logging()


# ─────────────────────────────────────────────────────────────────────────────
# Lifespan Context Manager (replaces deprecated on_event)
# Runs startup and shutdown logic around the application lifecycle.
# ─────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: load ML models into memory so they are ready to serve predictions.
    Shutdown: clean up resources (e.g., close DB connections, flush logs).
    """
    logger.info("═══════════════════════════════════════════════════════")
    logger.info("  🏥  Jeeva Raksha — ML Inference Service")
    logger.info(f"  ➤  Environment : {settings.ENVIRONMENT}")
    logger.info(f"  ➤  Version     : {settings.APP_VERSION}")
    logger.info(f"  ➤  API Docs    : http://{settings.HOST}:{settings.PORT}/docs")
    logger.info("═══════════════════════════════════════════════════════")

    # TODO: Pre-load trained scikit-learn models here when modules are added
    # from app.models.model_loader import load_all_models
    # load_all_models()

    yield  # Application is running

    # Shutdown logic
    logger.info("[ML Service] Shutting down. Releasing resources...")


# ─────────────────────────────────────────────────────────────────────────────
# FastAPI Application Instance
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Jeeva Raksha ML Inference Service — provides AI/ML prediction endpoints "
        "for disease detection, symptom analysis, and health recommendations."
    ),
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc UI
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS Middleware
# Allow the Node.js backend (and dev tools) to call this service.
# ─────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Mount API Version 1 Router
# All ML endpoints are under /api/v1/
# ─────────────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")


# ─────────────────────────────────────────────────────────────────────────────
# Root / Health Check Endpoint
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Root health check")
async def root():
    """
    Basic health check endpoint.
    Returns service status and version information.
    """
    return {
        "success": True,
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "message": "Jeeva Raksha ML Service is running.",
        "docs": "/docs",
    }
