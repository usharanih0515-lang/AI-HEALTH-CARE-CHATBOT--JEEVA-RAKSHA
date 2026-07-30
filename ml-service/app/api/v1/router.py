"""
=============================================================================
Jeeva Raksha — ML Service API v1 Router (app/api/v1/router.py)
=============================================================================
Description : Aggregates all v1 API endpoint routers into a single router
              that is mounted at /api/v1 by main.py.

              Add new feature routers here as the application grows.

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health

# ─────────────────────────────────────────────────────────────────────────────
# Main v1 API Router
# ─────────────────────────────────────────────────────────────────────────────
api_router = APIRouter()

# ── Health & Status ───────────────────────────────────────────────────────────
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

# ── Future Feature Routers ────────────────────────────────────────────────────
# When healthcare ML modules are added, register them here. For example:
#
# from app.api.v1.endpoints import symptom_checker, disease_predictor
#
# api_router.include_router(
#     symptom_checker.router,
#     prefix="/symptom-checker",
#     tags=["Symptom Checker"],
# )
# api_router.include_router(
#     disease_predictor.router,
#     prefix="/disease-predictor",
#     tags=["Disease Predictor"],
# )
