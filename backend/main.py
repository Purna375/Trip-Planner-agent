"""
FastAPI main application for AI Trip Planner.
Production-ready with CORS, error handling, and proper configuration.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from routes.trip_planner import router as trip_router
from utils.config import settings
import logging
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="AI Trip Planner API",
    description="""
    Intelligent trip planning system using AI agents.
    
    ## Features
    - **AI-Powered Planning**: Uses LangChain agents with ReAct pattern
    - **Real-time Data**: Integrates OpenStreetMap, Open-Meteo, and more
    - **Smart Recommendations**: Weather-based adjustments and packing lists
    - **Structured Output**: Day-by-day itineraries in JSON format
    
    ## How It Works
    1. Agent gets destination coordinates
    2. Fetches weather forecast for your dates
    3. Finds points of interest based on your preferences
    4. Creates optimized daily itinerary
    5. Generates smart recommendations
    
    ## Get Started
    Post your trip requirements to `/api/plan-trip` and receive a complete itinerary!
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")
    logger.info(f"Mounted static files from {frontend_path}")

# Include routers
app.include_router(trip_router)


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "service": "AI Trip Planner API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "plan_trip": "/api/plan-trip",
            "sample_request": "/api/sample-request",
            "sample_response": "/api/sample-response",
            "docs": "/docs",
            "redoc": "/redoc"
        },
        "agent_info": {
            "framework": "LangChain",
            "pattern": "ReAct (Reasoning + Acting)",
            "llm": "Groq (Llama 3.1 70B)",
            "speed": "Ultra-fast inference",
            "tools": [
                "get_coordinates",
                "get_weather",
                "get_points_of_interest",
                "calculate_route"
            ]
        },
        "data_sources": [
            "OpenStreetMap (Nominatim)",
            "Open-Meteo",
            "Overpass API",
            "OpenRouteService"
        ]
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected error occurred",
            "detail": str(exc) if settings.debug else "Internal server error"
        }
    )


@app.on_event("startup")
async def startup_event():
    """
    Application startup event.
    """
    logger.info("=" * 60)
    logger.info("AI Trip Planner Starting...")
    logger.info(f"Environment: {'Development' if settings.debug else 'Production'}")
    logger.info(f"Groq API Key configured: {'Yes' if settings.groq_api_key else 'No'}")
    logger.info(f"OpenRoute API Key configured: {'Yes' if settings.openroute_api_key else 'No'} (optional)")
    logger.info("=" * 60)
    
    # Validate critical configuration
    if not settings.groq_api_key:
        logger.warning("⚠️  Groq API key not configured! Set GROQ_API_KEY in .env file.")
        logger.warning("⚠️  Get your free API key at: https://console.groq.com")
        logger.warning("⚠️  Trip planning will not work without it.")
    else:
        logger.info("✓ Groq API key configured")
    
    logger.info(f"Server will start on http://{settings.host}:{settings.port}")
    logger.info(f"API Documentation: http://{settings.host}:{settings.port}/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event.
    """
    logger.info("AI Trip Planner shutting down...")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
