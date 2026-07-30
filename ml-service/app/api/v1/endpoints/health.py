"""
=============================================================================
Jeeva Raksha — Health Endpoint (app/api/v1/endpoints/health.py)
=============================================================================
Description : Provides health check endpoints for the ML service.
              Used by load balancers, monitoring tools, and the Express backend
              to verify the ML service is operational before routing requests.

Endpoints   :
  GET /api/v1/health        — Basic liveness check
  GET /api/v1/health/models — Check which ML models are loaded

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

import os
from datetime import datetime, timezone

from fastapi import APIRouter
from loguru import logger

from app.core.config import settings

router = APIRouter()


@router.get("/", summary="Service liveness check")
async def health_check():
    """
    Returns the service status, version, and uptime information.
    A 200 response confirms the ML service is running.
    """
    logger.debug("[Health] Liveness check requested.")
    return {
        "success"    : True,
        "service"    : settings.APP_NAME,
        "version"    : settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status"     : "healthy",
        "timestamp"  : datetime.now(timezone.utc).isoformat(),
    }


@router.get("/models", summary="List loaded ML models")
async def models_status():
    """
    Lists all .joblib model files found in the MODELS_DIR directory.
    Reports whether each model file exists and is accessible.
    Used to verify that trained models have been deployed correctly.
    """
    models_dir = settings.MODELS_DIR
    model_files = []

    if os.path.isdir(models_dir):
        for filename in os.listdir(models_dir):
            if filename.endswith(".joblib"):
                filepath = os.path.join(models_dir, filename)
                model_files.append({
                    "name"    : filename,
                    "path"    : filepath,
                    "size_kb" : round(os.path.getsize(filepath) / 1024, 2),
                    "status"  : "available",
                })
    else:
        logger.warning(f"[Health] Models directory not found: {models_dir}")

    return {
        "success"     : True,
        "models_dir"  : models_dir,
        "model_count" : len(model_files),
        "models"      : model_files,
        "note"        : "No models yet." if not model_files else "Models are loaded.",
    }
