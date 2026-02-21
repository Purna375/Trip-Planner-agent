"""
Configuration management using environment variables.
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings with validation."""
    
    # Groq Configuration
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    
    # OpenRouteService Configuration (optional, has fallback)
    openroute_api_key: str = os.getenv("OPENROUTE_API_KEY", "")
    
    # Server Configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ]
    
    # API Endpoints (Free services)
    nominatim_base_url: str = "https://nominatim.openstreetmap.org"
    open_meteo_base_url: str = "https://api.open-meteo.com/v1"
    openroute_base_url: str = "https://api.openrouteservice.org"
    overpass_base_url: str = "https://overpass-api.de/api/interpreter"
    
    # API Rate Limiting
    user_agent: str = "TripPlannerAI/1.0"
    request_timeout: int = 30
    
    # LLM Configuration (Groq)
    llm_model: str = "llama-3.1-8b-instant"  # Fast, stable Groq model
    llm_temperature: float = 0.7
    max_tokens: int = 2000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
