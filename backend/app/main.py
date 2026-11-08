import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.core.config import settings
from backend.app.api.routes import (
    analysis, solutions, comparison, roast, improvement, reports, modules, settings as settings_routes
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ideascore_ai")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IdeaScore AI - Don't Just Build Ideas. Validate Them. Real-world TinyFish research + Gemini evaluation + Groq roast engine."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analysis.router)
app.include_router(solutions.router)
app.include_router(comparison.router)
app.include_router(roast.router)
app.include_router(improvement.router)
app.include_router(reports.router)
app.include_router(modules.router)
app.include_router(settings_routes.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Mount built frontend if available
dist_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {
            "app": settings.PROJECT_NAME,
            "tagline": settings.TAGLINE,
            "version": settings.VERSION,
            "status": "operational",
            "documentation": "/docs"
        }

