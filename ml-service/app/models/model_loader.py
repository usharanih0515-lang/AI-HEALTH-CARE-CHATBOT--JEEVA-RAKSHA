"""
=============================================================================
Jeeva Raksha — ML Model Loader (app/models/model_loader.py)
=============================================================================
Description : Utility for loading, caching, and managing scikit-learn models.
              Models are loaded from .joblib files on disk into a shared
              in-memory registry so they are ready for low-latency inference
              without loading from disk on every request.

Usage       :
  from app.models.model_loader import ModelLoader

  # Load a model
  model = ModelLoader.get("symptom_checker")

  # Run a prediction
  prediction = model.predict([[...]])

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

import os
from typing import Any, Dict, Optional

import joblib
from loguru import logger

from app.core.config import settings


class ModelLoader:
    """
    Singleton-style in-memory model registry.
    Loads scikit-learn models from .joblib files and caches them by name.
    """

    # In-memory model cache: { model_name: sklearn_model_object }
    _registry: Dict[str, Any] = {}

    @classmethod
    def load(cls, model_name: str, filename: Optional[str] = None) -> Any:
        """
        Load a model from disk and store it in the registry.

        Args:
            model_name : A unique key used to retrieve the model later.
            filename   : The .joblib filename (defaults to <model_name>.joblib).

        Returns:
            The loaded scikit-learn model object.

        Raises:
            FileNotFoundError: If the model file does not exist.
        """
        filename  = filename or f"{model_name}.joblib"
        filepath  = os.path.join(settings.MODELS_DIR, filename)

        if not os.path.isfile(filepath):
            logger.error(f"[ModelLoader] Model file not found: {filepath}")
            raise FileNotFoundError(f"Model file not found: {filepath}")

        logger.info(f"[ModelLoader] Loading model '{model_name}' from {filepath}")
        model = joblib.load(filepath)
        cls._registry[model_name] = model
        logger.info(f"[ModelLoader] Model '{model_name}' loaded and cached.")
        return model

    @classmethod
    def get(cls, model_name: str) -> Any:
        """
        Retrieve a previously loaded model from the registry.

        Args:
            model_name : The key used when the model was loaded.

        Returns:
            The cached scikit-learn model.

        Raises:
            KeyError: If the model has not been loaded yet.
        """
        if model_name not in cls._registry:
            raise KeyError(
                f"Model '{model_name}' is not loaded. "
                f"Call ModelLoader.load('{model_name}') first."
            )
        return cls._registry[model_name]

    @classmethod
    def list_loaded(cls) -> list[str]:
        """
        Return the names of all currently loaded models.

        Returns:
            List of model name strings.
        """
        return list(cls._registry.keys())

    @classmethod
    def is_loaded(cls, model_name: str) -> bool:
        """
        Check if a specific model is available in the registry.

        Args:
            model_name : The model key to check.

        Returns:
            True if the model is loaded, False otherwise.
        """
        return model_name in cls._registry
