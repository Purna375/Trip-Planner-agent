"""
LangChain tools for the trip planning agent.
Each tool wraps an API service call and provides structured input/output.
"""
from langchain_core.tools import Tool
from pydantic import BaseModel, Field
from typing import Dict, Any, List
from services.api_service import api_service
import asyncio
import json
from concurrent.futures import ThreadPoolExecutor
import threading

# Thread pool for running async code
_executor = ThreadPoolExecutor(max_workers=10)


class CoordinatesInput(BaseModel):
    """Input schema for get_coordinates tool."""
    location: str = Field(description="City or location name to geocode")


class WeatherInput(BaseModel):
    """Input schema for get_weather tool."""
    lat: float = Field(description="Latitude coordinate")
    lon: float = Field(description="Longitude coordinate")
    start_date: str = Field(description="Start date in YYYY-MM-DD format")
    end_date: str = Field(description="End date in YYYY-MM-DD format")


class POIInput(BaseModel):
    """Input schema for get_points_of_interest tool."""
    lat: float = Field(description="Latitude coordinate")
    lon: float = Field(description="Longitude coordinate")
    interests: str = Field(description="Comma-separated list of interests")


class RouteInput(BaseModel):
    """Input schema for calculate_route tool."""
    start_lat: float = Field(description="Starting point latitude")
    start_lon: float = Field(description="Starting point longitude")
    end_lat: float = Field(description="Ending point latitude")
    end_lon: float = Field(description="Ending point longitude")


def run_async(coro):
    """Helper to run async functions in sync context using a thread pool."""
    def run_in_thread():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(coro)
        finally:
            loop.close()
    
    future = _executor.submit(run_in_thread)
    return future.result(timeout=30)


def get_coordinates_tool(location: str) -> str:
    """
    Get geographical coordinates for a location.
    
    Args:
        location: City or location name
    
    Returns:
        JSON string with lat, lon, and display_name
    """
    result = run_async(api_service.get_coordinates(location))
    if result:
        return json.dumps(result)
    return json.dumps({"error": "Location not found"})


def get_weather_tool(lat: float, lon: float, start_date: str, end_date: str) -> str:
    """
    Get weather forecast for coordinates and date range.
    
    Args:
        lat: Latitude
        lon: Longitude
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
    
    Returns:
        JSON string with weather data
    """
    result = run_async(api_service.get_weather_forecast(lat, lon, start_date, end_date))
    if result:
        # Simplify the response
        daily = result.get("daily", {})
        simplified = {
            "dates": daily.get("time", []),
            "temp_max": daily.get("temperature_2m_max", []),
            "temp_min": daily.get("temperature_2m_min", []),
            "precipitation": daily.get("precipitation_sum", []),
            "weather_codes": daily.get("weathercode", [])
        }
        return json.dumps(simplified)
    return json.dumps({"error": "Weather data not available"})


def get_points_of_interest_tool(lat: float, lon: float, interests: str) -> str:
    """
    Get points of interest near coordinates based on interests.
    
    Args:
        lat: Latitude
        lon: Longitude
        interests: Comma-separated interests
    
    Returns:
        JSON string with list of POIs
    """
    interest_list = [i.strip() for i in interests.split(",")]
    result = run_async(api_service.get_points_of_interest(lat, lon, 5000, interest_list))
    return json.dumps(result[:20])  # Limit to 20 POIs


def calculate_route_tool(start_lat: float, start_lon: float, end_lat: float, end_lon: float) -> str:
    """
    Calculate route distance and duration between two points.
    
    Args:
        start_lat: Starting latitude
        start_lon: Starting longitude
        end_lat: Ending latitude
        end_lon: Ending longitude
    
    Returns:
        JSON string with distance and duration
    """
    result = run_async(api_service.calculate_route_distance(
        (start_lat, start_lon),
        (end_lat, end_lon)
    ))
    return json.dumps(result)


# Define LangChain tools
coordinates_tool = Tool(
    name="get_coordinates",
    func=get_coordinates_tool,
    description="""
    Get geographical coordinates (latitude and longitude) for a city or location name.
    Input: location name as a string (e.g., "Paris, France")
    Output: JSON with lat, lon, and display_name
    Use this tool first to get coordinates for the destination.
    """
)

weather_tool = Tool(
    name="get_weather",
    func=lambda x: get_weather_tool(**eval(x)),
    description="""
    Get weather forecast for specific coordinates and date range.
    Input: dict with keys: lat (float), lon (float), start_date (str YYYY-MM-DD), end_date (str YYYY-MM-DD)
    Output: JSON with daily temperature, precipitation, and weather codes
    Use this after getting coordinates to understand weather conditions.
    Example input: "{'lat': 48.8566, 'lon': 2.3522, 'start_date': '2024-06-01', 'end_date': '2024-06-05'}"
    """
)

poi_tool = Tool(
    name="get_points_of_interest",
    func=lambda x: get_points_of_interest_tool(**eval(x)),
    description="""
    Get tourist attractions and points of interest near coordinates.
    Input: dict with keys: lat (float), lon (float), interests (str - comma separated)
    Output: JSON list of POIs with name, type, lat, lon
    Use this to find activities and attractions for the itinerary.
    Example input: "{'lat': 48.8566, 'lon': 2.3522, 'interests': 'culture,museums,food'}"
    """
)

route_tool = Tool(
    name="calculate_route",
    func=lambda x: calculate_route_tool(**eval(x)),
    description="""
    Calculate travel distance and time between two locations.
    Input: dict with keys: start_lat, start_lon, end_lat, end_lon (all floats)
    Output: JSON with distance_km and duration_minutes
    Use this to estimate travel time between activities.
    Example input: "{'start_lat': 48.8566, 'start_lon': 2.3522, 'end_lat': 48.8606, 'end_lon': 2.3376}"
    """
)


# Export all tools
trip_planning_tools = [
    coordinates_tool,
    weather_tool,
    poi_tool,
    route_tool
]
