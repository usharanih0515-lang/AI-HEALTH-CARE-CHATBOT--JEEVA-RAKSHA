"""
=============================================================================
Jeeva Raksha — Pydantic Schemas (app/schemas/base.py)
=============================================================================
Description : Base Pydantic v2 schemas for standardising all API request
              and response envelopes across the ML service.

              Feature-specific schemas (e.g., SymptomCheckerRequest) will
              be defined in their own schema files and imported here or
              directly in endpoint modules.

Author      : Jeeva Raksha Dev Team
=============================================================================
"""

from datetime import datetime, timezone
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

# Generic type variable for the response data payload
DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    """
    Standard API response envelope.
    All ML service endpoints should return this structure for consistency
    with the Node.js backend response format.

    Example:
        {
            "success": true,
            "message": "Prediction complete.",
            "data": { ... },
            "timestamp": "2024-01-01T00:00:00+00:00"
        }
    """
    success  : bool              = Field(...,  description="Whether the request succeeded")
    message  : str               = Field(...,  description="Human-readable status message")
    data     : Optional[DataT]   = Field(None, description="Response payload")
    timestamp: str               = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )


class ErrorResponse(BaseModel):
    """
    Standard error response envelope returned on API failures.

    Example:
        {
            "success": false,
            "message": "Invalid input data.",
            "detail": "Field 'age' must be a positive integer.",
            "timestamp": "2024-01-01T00:00:00+00:00"
        }
    """
    success  : bool          = Field(False, description="Always false for errors")
    message  : str           = Field(...,   description="Human-readable error message")
    detail   : Optional[Any] = Field(None,  description="Detailed error info or validation errors")
    timestamp: str           = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )
