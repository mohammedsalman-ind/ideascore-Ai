import os
from pathlib import Path
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load .env file from project root or backend
root_dir = Path(__file__).resolve().parent.parent.parent.parent
env_paths = [
    root_dir / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
]
for p in env_paths:
    if p.exists():
        load_dotenv(p)
        break

class Settings:
    PROJECT_NAME: str = "IdeaScore AI"
    VERSION: str = "1.0.0"
    TAGLINE: str = "Don't Just Build Ideas. Validate Them."

    # API Keys
    TINYFISH_API_KEY: str = os.getenv("TINYFISH_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # TinyFish Endpoints
    TINYFISH_SEARCH_URL: str = os.getenv("TINYFISH_SEARCH_URL", "https://api.search.tinyfish.ai")
    TINYFISH_FETCH_URL: str = os.getenv("TINYFISH_FETCH_URL", "https://api.fetch.tinyfish.ai")
    TINYFISH_AGENT_URL: str = os.getenv("TINYFISH_AGENT_URL", "https://agent.tinyfish.ai/v1/automation/run")

    # Evaluation Weights (Must sum to 1.0)
    EVALUATION_WEIGHTS: Dict[str, float] = {
        "problem_significance": 0.15,
        "market_potential": 0.15,
        "innovation": 0.15,
        "technical_feasibility": 0.15,
        "scalability": 0.10,
        "revenue_potential": 0.15,
        "competitive_positioning": 0.10,
        "social_impact": 0.05,
    }

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
