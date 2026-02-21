"""
Service layer for external API integrations.
Handles calls to OpenStreetMap, Open-Meteo, OpenRouteService, and Overpass API.
"""
import httpx
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from utils.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class APIService:
    """Service for managing external API calls."""
    
    def __init__(self):
        self.timeout = settings.request_timeout
        self.user_agent = settings.user_agent
    
    async def get_coordinates(self, location: str) -> Optional[Dict[str, Any]]:
        """
        Get coordinates for a location using OpenStreetMap Nominatim.
        
        Args:
            location: City or location name
        
        Returns:
            Dictionary with lat, lon, and display_name, or None if not found
        """
        url = f"{settings.nominatim_base_url}/search"
        params = {
            "q": location,
            "format": "json",
            "limit": 1
        }
        headers = {
            "User-Agent": self.user_agent
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                if data and len(data) > 0:
                    result = data[0]
                    return {
                        "lat": float(result["lat"]),
                        "lon": float(result["lon"]),
                        "display_name": result.get("display_name", location)
                    }
                return None
        except Exception as e:
            logger.error(f"Error getting coordinates for {location}: {e}")
            return None
    
    async def get_weather_forecast(
        self, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get weather forecast using Open-Meteo API.
        
        Args:
            lat: Latitude
            lon: Longitude
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
        
        Returns:
            Weather data dictionary or None
        """
        url = f"{settings.open_meteo_base_url}/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Error getting weather forecast: {e}")
            return None
    
    async def get_points_of_interest(
        self,
        lat: float,
        lon: float,
        radius: int = 5000,
        interests: List[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get points of interest using Overpass API.
        
        Args:
            lat: Latitude
            lon: Longitude
            radius: Search radius in meters (default 5000m)
            interests: List of user interests to filter POIs
        
        Returns:
            List of POI dictionaries
        """
        # Map interests to OSM tags
        interest_tags = self._map_interests_to_tags(interests or [])
        
        # Build Overpass QL query
        query_parts = []
        for tag in interest_tags:
            query_parts.append(f'node["{tag}"](around:{radius},{lat},{lon});')
            query_parts.append(f'way["{tag}"](around:{radius},{lat},{lon});')
        
        if not query_parts:
            # Default query for tourist attractions
            query_parts = [
                f'node["tourism"](around:{radius},{lat},{lon});',
                f'way["tourism"](around:{radius},{lat},{lon});'
            ]
        
        query = f"""
        [out:json][timeout:25];
        (
            {' '.join(query_parts)}
        );
        out body;
        >;
        out skel qt;
        """
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    settings.overpass_base_url,
                    data={"data": query}
                )
                response.raise_for_status()
                data = response.json()
                
                # Parse and format POIs
                pois = []
                for element in data.get("elements", [])[:50]:  # Limit to 50 POIs
                    if "tags" in element:
                        poi = {
                            "name": element["tags"].get("name", "Unnamed Location"),
                            "type": element["tags"].get("tourism") or 
                                   element["tags"].get("amenity") or 
                                   element["tags"].get("historic", "attraction"),
                            "lat": element.get("lat"),
                            "lon": element.get("lon")
                        }
                        if poi["name"] != "Unnamed Location" and poi["lat"] and poi["lon"]:
                            pois.append(poi)
                
                return pois
        except Exception as e:
            logger.error(f"Error getting points of interest: {e}")
            return []
    
    def _map_interests_to_tags(self, interests: List[str]) -> List[str]:
        """Map user interests to OpenStreetMap tags."""
        tag_mapping = {
            "culture": ["tourism=museum", "tourism=gallery", "tourism=attraction"],
            "history": ["historic", "tourism=castle", "tourism=monument"],
            "food": ["amenity=restaurant", "amenity=cafe", "cuisine"],
            "nature": ["natural", "leisure=park", "tourism=viewpoint"],
            "adventure": ["sport", "leisure=sports_centre"],
            "museums": ["tourism=museum", "tourism=gallery"],
            "art": ["tourism=gallery", "tourism=artwork"],
            "shopping": ["shop"],
            "nightlife": ["amenity=bar", "amenity=nightclub"],
            "beaches": ["natural=beach"],
            "architecture": ["building", "historic=building"],
            "hiking": ["route=hiking", "leisure=nature_reserve"],
            "local_life": ["amenity=marketplace", "tourism=attraction"]
        }
        
        tags = []
        for interest in interests:
            if interest.lower() in tag_mapping:
                tags.extend(tag_mapping[interest.lower()])
        
        return list(set(tags))[:5]  # Limit to 5 unique tags
    
    async def calculate_route_distance(
        self,
        start_coords: Tuple[float, float],
        end_coords: Tuple[float, float]
    ) -> Optional[Dict[str, Any]]:
        """
        Calculate route distance and duration between two points.
        Uses OpenRouteService if API key available, otherwise estimates.
        
        Args:
            start_coords: (lat, lon) tuple for start point
            end_coords: (lat, lon) tuple for end point
        
        Returns:
            Dictionary with distance (km) and duration (minutes)
        """
        if settings.openroute_api_key:
            return await self._calculate_route_ors(start_coords, end_coords)
        else:
            return self._estimate_route(start_coords, end_coords)
    
    async def _calculate_route_ors(
        self,
        start_coords: Tuple[float, float],
        end_coords: Tuple[float, float]
    ) -> Optional[Dict[str, Any]]:
        """Calculate route using OpenRouteService API."""
        url = f"{settings.openroute_base_url}/v2/directions/driving-car"
        headers = {
            "Authorization": settings.openroute_api_key,
            "Content-Type": "application/json"
        }
        
        # ORS expects [lon, lat] format
        body = {
            "coordinates": [
                [start_coords[1], start_coords[0]],
                [end_coords[1], end_coords[0]]
            ]
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=body, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                route = data["routes"][0]
                summary = route["summary"]
                
                return {
                    "distance_km": round(summary["distance"] / 1000, 2),
                    "duration_minutes": round(summary["duration"] / 60, 0)
                }
        except Exception as e:
            logger.warning(f"Error with OpenRouteService, using estimation: {e}")
            return self._estimate_route(start_coords, end_coords)
    
    def _estimate_route(
        self,
        start_coords: Tuple[float, float],
        end_coords: Tuple[float, float]
    ) -> Dict[str, Any]:
        """
        Estimate route distance using Haversine formula.
        Fallback when OpenRouteService is not available.
        """
        from math import radians, cos, sin, asin, sqrt
        
        lat1, lon1 = start_coords
        lat2, lon2 = end_coords
        
        # Haversine formula
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6371 * c  # Radius of earth in kilometers
        
        # Estimate duration (assuming average speed of 30 km/h in cities)
        duration_minutes = (km / 30) * 60
        
        return {
            "distance_km": round(km, 2),
            "duration_minutes": round(duration_minutes, 0)
        }
    
    def interpret_weather_code(self, code: int) -> str:
        """
        Interpret WMO weather code from Open-Meteo.
        
        Args:
            code: Weather code
        
        Returns:
            Human-readable weather description
        """
        weather_codes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        }
        return weather_codes.get(code, "Unknown")


# Global API service instance
api_service = APIService()
