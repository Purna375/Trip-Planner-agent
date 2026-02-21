"""
FastAPI routes for trip planning endpoints.
"""
from fastapi import APIRouter, HTTPException, status
from models.schemas import TripRequest, TripResponse, ErrorResponse
from services.trip_service import trip_service
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["trip-planning"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Status message
    """
    return {
        "status": "healthy",
        "service": "AI Trip Planner",
        "version": "1.0.0"
    }


@router.post("/plan-trip", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    """
    Plan a trip based on user requirements.
    
    This endpoint uses an AI agent to:
    1. Get location coordinates
    2. Fetch weather forecast
    3. Find points of interest
    4. Create optimized itinerary
    5. Generate smart recommendations
    
    Args:
        request: Trip planning request with destination, dates, budget, etc.
    
    Returns:
        Complete trip itinerary with daily activities and recommendations
    
    Raises:
        HTTPException: If trip planning fails
    """
    try:
        logger.info(f"Received trip planning request for {request.destination}")
        
        # Validate Groq API key
        from utils.config import settings
        if not settings.groq_api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Groq API key not configured. Please set GROQ_API_KEY in .env file. Get free key at https://console.groq.com"
            )
        
        # Plan the trip using the service
        trip_response = await trip_service.plan_trip(request)
        
        logger.info(f"Successfully planned trip to {request.destination}")
        return trip_response
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error planning trip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to plan trip: {str(e)}"
        )


@router.get("/sample-request")
async def get_sample_request():
    """
    Get a sample trip request for testing.
    
    Returns:
        Sample request JSON
    """
    return {
        "destination": "Paris, France",
        "start_date": "2024-06-15",
        "end_date": "2024-06-18",
        "budget": 1500.0,
        "travelers": 2,
        "interests": ["culture", "food", "museums", "architecture"],
        "pace": "balanced"
    }


@router.get("/sample-response")
async def get_sample_response():
    """
    Get a sample trip response structure.
    
    Returns:
        Sample response JSON structure
    """
    return {
        "status": "success",
        "overview": {
            "destination": "Paris, France",
            "duration": 4,
            "start_date": "2024-06-15",
            "end_date": "2024-06-18",
            "total_budget": 1500.0,
            "daily_budget": 375.0,
            "travelers": 2,
            "weather_summary": "Expected temperatures: 15°C to 24°C",
            "coordinates": {"lat": 48.8566, "lon": 2.3522}
        },
        "itinerary": [
            {
                "day": 1,
                "date": "2024-06-15",
                "morning": {
                    "name": "Eiffel Tower Visit",
                    "description": "Start your Paris adventure at the iconic Eiffel Tower",
                    "duration": "2-3 hours",
                    "estimated_cost": 30.0,
                    "location": "Champ de Mars",
                    "time_of_day": "morning"
                },
                "afternoon": {
                    "name": "Louvre Museum",
                    "description": "Explore world-famous art collections",
                    "duration": "3-4 hours",
                    "estimated_cost": 50.0,
                    "location": "Rue de Rivoli",
                    "time_of_day": "afternoon"
                },
                "evening": {
                    "name": "Seine River Cruise",
                    "description": "Enjoy Paris views from the water",
                    "duration": "2 hours",
                    "estimated_cost": 35.0,
                    "location": "Port de la Bourdonnais",
                    "time_of_day": "evening"
                },
                "total_cost": 115.0,
                "travel_time": "30-60 minutes between activities",
                "weather": "Partly cloudy 18°C - 23°C",
                "notes": "Day 1 - Welcome to Paris!"
            }
        ],
        "smart_additions": {
            "packing_list": [
                "Light jacket",
                "Comfortable walking shoes",
                "Sunscreen",
                "Reusable water bottle"
            ],
            "weather_tips": [
                "Comfortable weather for outdoor activities",
                "Light jacket recommended for evenings"
            ],
            "alternate_activities": [
                "Visit Montmartre for artistic atmosphere",
                "Explore Latin Quarter's charming streets"
            ],
            "local_tips": [
                "Learn basic French phrases",
                "Try local bakeries for breakfast"
            ]
        },
        "metadata": {
            "generated_at": "2024-06-10T10:00:00",
            "agent_used": "langchain_react"
        }
    }
