"""
=============================================================================
Jeeva Raksha — Application Configuration (app/core/config.py)
=============================================================================
Description : Centralised settings management using Pydantic BaseSettings.
              All configuration values are loaded from the .env file and
              validated at application startup. Type errors will cause an
              immediate, descriptive failure rather than a silent runtime bug.

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application-wide settings.
    Values are read from environment variables or the .env file.
    """

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str    = Field(default="jeeva-raksha-ml-service", description="Service name")
    APP_VERSION: str = Field(default="1.0.0", description="Service version")
    ENVIRONMENT: str = Field(default="development", description="Runtime environment")
    DEBUG: bool      = Field(default=True,  description="Enable debug mode")

    # ── Server ───────────────────────────────────────────────────────────────
    HOST: str = Field(default="0.0.0.0", description="Bind host")
    PORT: int = Field(default=8000,      description="Bind port")

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Accepts a comma-separated string from the .env file and splits into a list
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:5000", "http://localhost:3000"],
        description="Comma-separated list of allowed CORS origins",
    )

    # ── Models ───────────────────────────────────────────────────────────────
    MODELS_DIR: str = Field(default="./models", description="Directory for .joblib model files")

    # ── Logging ──────────────────────────────────────────────────────────────
    LOG_LEVEL: str = Field(default="DEBUG", description="Loguru log level")
    LOG_DIR: str   = Field(default="./logs", description="Log file directory")

    # ── Backend API ───────────────────────────────────────────────────────────
    BACKEND_API_URL: str = Field(default="http://localhost:5000", description="Node.js backend URL")
    BACKEND_API_KEY: str = Field(default="",                      description="Internal API key")

    # ── Pydantic Settings Config ──────────────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",          # Load from .env in the current directory
        env_file_encoding="utf-8",
        case_sensitive=False,     # DB_HOST and db_host are treated the same
        extra="ignore",           # Ignore undeclared env variables
    )


# ─────────────────────────────────────────────────────────────────────────────
# Singleton settings instance — import this wherever config is needed.
# ─────────────────────────────────────────────────────────────────────────────
settings = Settings()
