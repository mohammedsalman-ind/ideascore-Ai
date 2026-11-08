from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict
from backend.app.core.config import settings
from backend.app.services.tinyfish_service import tinyfish_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.groq_service import groq_service

router = APIRouter(prefix="/api/settings", tags=["Settings & Keys"])

class SettingsUpdatePayload(BaseModel):
    tinyfish_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    gemini_model: Optional[str] = None
    groq_model: Optional[str] = None

def _mask_key(key: str) -> str:
    if not key or len(key) < 8:
        return "Not Configured"
    return f"{key[:4]}...{key[-4:]}"

@router.get("")
async def get_settings_status():
    """Returns provider connection status and masked keys."""
    return {
        "tinyfish": {
            "configured": tinyfish_service.is_configured(),
            "masked_key": _mask_key(tinyfish_service.api_key),
            "engine": "TinySearch (api.search.tinyfish.ai) + TinyFetch (api.fetch.tinyfish.ai)"
        },
        "gemini": {
            "configured": gemini_service.is_configured(),
            "masked_key": _mask_key(gemini_service.api_key),
            "model": gemini_service.model
        },
        "groq": {
            "configured": groq_service.is_configured(),
            "masked_key": _mask_key(groq_service.api_key),
            "model": groq_service.model
        },
        "supabase": {
            "configured": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY),
            "url": settings.SUPABASE_URL or "Local Persistent Storage Active"
        },
        "demo_sandbox_mode": not (tinyfish_service.is_configured() and gemini_service.is_configured() and groq_service.is_configured()),
        "weights": settings.EVALUATION_WEIGHTS
    }

@router.post("")
async def update_settings(payload: SettingsUpdatePayload):
    """Allows user to update API keys at runtime via the UI settings modal."""
    if payload.tinyfish_api_key is not None:
        tinyfish_service.set_api_key(payload.tinyfish_api_key)
        settings.TINYFISH_API_KEY = payload.tinyfish_api_key

    if payload.gemini_api_key is not None:
        gemini_service.set_api_key(payload.gemini_api_key)
        settings.GEMINI_API_KEY = payload.gemini_api_key

    if payload.groq_api_key is not None:
        groq_service.set_api_key(payload.groq_api_key)
        settings.GROQ_API_KEY = payload.groq_api_key

    if payload.gemini_model is not None:
        gemini_service.set_model(payload.gemini_model)
        settings.GEMINI_MODEL = payload.gemini_model

    if payload.groq_model is not None:
        groq_service.set_model(payload.groq_model)
        settings.GROQ_MODEL = payload.groq_model

    return await get_settings_status()

