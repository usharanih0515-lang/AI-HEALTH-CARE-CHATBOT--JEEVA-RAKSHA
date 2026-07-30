"""
=============================================================================
Jeeva Raksha — Loguru Logging Configuration (app/core/logging.py)
=============================================================================
Description : Configures Loguru as the application's structured logger.
              Outputs colourised logs to the console in development and
              JSON-structured rotating log files in production.

Usage       :
  from app.core.logging import setup_logging
  setup_logging()

  from loguru import logger
  logger.info("Something happened")

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

import sys
import os
from loguru import logger


def setup_logging() -> None:
    """
    Configure Loguru sinks (outputs) for the application.
    Called once during application startup in main.py.
    """

    from app.core.config import settings

    log_level = settings.LOG_LEVEL.upper()
    log_dir   = settings.LOG_DIR

    # Ensure log directory exists
    os.makedirs(log_dir, exist_ok=True)

    # ── Remove Loguru's default stderr sink ──────────────────────────────────
    logger.remove()

    # ── Console Sink (development-friendly, colourised) ───────────────────────
    logger.add(
        sys.stdout,
        level=log_level,
        colorize=True,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> — "
            "<level>{message}</level>"
        ),
        enqueue=True,    # Thread-safe async logging
        backtrace=True,  # Show full traceback on exceptions
        diagnose=settings.DEBUG,
    )

    # ── File Sink — Error logs (rotating, 7-day retention) ────────────────────
    logger.add(
        os.path.join(log_dir, "error_{time:YYYY-MM-DD}.log"),
        level="ERROR",
        rotation="1 day",
        retention="7 days",
        compression="zip",
        serialize=True,   # JSON format for log aggregation
        enqueue=True,
        backtrace=True,
        diagnose=False,   # Disable sensitive variable display in production
    )

    # ── File Sink — Combined logs (rotating, 14-day retention) ────────────────
    logger.add(
        os.path.join(log_dir, "app_{time:YYYY-MM-DD}.log"),
        level=log_level,
        rotation="1 day",
        retention="14 days",
        compression="zip",
        serialize=True,
        enqueue=True,
        backtrace=True,
        diagnose=False,
    )

    logger.info(f"[Logging] Configured. Level: {log_level} | Log dir: {log_dir}")
