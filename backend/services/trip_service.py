"""
Main trip planning service.
Orchestrates the agent, formats responses, and adds smart features.
"""
from typing import Dict, Any
from models.schemas import TripRequest, TripResponse, TripOverview, DayItinerary, Activity, SmartAdditions
from agents.trip_agent import get_trip_agent
from utils.helpers import (
    calculate_trip_duration,
    calculate_daily_budget,
    get_date_range,
    generate_packing_list,
    format_duration,
    format_currency
)
from services.api_service import api_service
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TripService:
    """Service for trip planning business logic."""
    
    def __init__(self):
        self.agent = get_trip_agent()
    
    async def plan_trip(self, request: TripRequest) -> TripResponse:
        """
        Main method to plan a trip end-to-end.
        Uses fast mode for optimal performance.
        
        Args:
            request: Validated trip request
        
        Returns:
            Complete trip response with itinerary
        """
        # Always use fast mode
        return await self.plan_trip_fast(request)
    
    async def plan_trip_fast(self, request: TripRequest) -> TripResponse:
        """
        Fast mode: Fetch all data directly, use AI once for formatting.
        10x faster than agent mode with 1 LLM call vs 5-8.
        
        Args:
            request: Validated trip request
        
        Returns:
            Complete trip response with itinerary
        """
        try:
            logger.info(f"Planning trip to {request.destination} (FAST MODE)")
            
            # Calculate basic trip metrics
            duration = calculate_trip_duration(request.start_date, request.end_date)
            daily_budget = calculate_daily_budget(request.budget, duration)
            date_range = get_date_range(request.start_date, request.end_date)
            
            # Step 1: Fetch coordinates (direct API, no AI)
            coords = await api_service.get_coordinates(request.destination)
            if not coords:
                raise ValueError(f"Could not find location: {request.destination}")
            
            # Step 2: Fetch weather (direct API, no AI)
            weather_data = await api_service.get_weather_forecast(
                coords['lat'],
                coords['lon'],
                request.start_date,
                request.end_date
            )
            
            # Step 3: Fetch POIs (direct API, no AI)
            pois = await api_service.get_points_of_interest(
                coords['lat'],
                coords['lon'],
                5000,  # 5km radius
                request.interests
            )
            
            # Step 4: Use AI once to format itinerary
            from langchain_groq import ChatGroq
            from utils.config import settings
            
            llm = ChatGroq(
                model=settings.llm_model,
                temperature=0.7,
                groq_api_key=settings.groq_api_key,
                model_kwargs={"response_format": {"type": "json_object"}}
            )
            
            # Create a comprehensive prompt with all gathered data
            activities_per_day = {"relaxed": 2, "balanced": 3, "packed": 4}.get(request.pace, 3)
            
            prompt = f"""Create a detailed {duration}-day trip itinerary for {request.destination}.

TRIP DETAILS:
- Destination: {request.destination}
- Dates: {request.start_date} to {request.end_date} ({duration} days)
- Budget: ${request.budget} total (${daily_budget:.2f}/day)
- Travelers: {request.travelers}
- Interests: {', '.join(request.interests)}
- Pace: {request.pace} ({activities_per_day} activities per day)

LOCATION DATA:
- Coordinates: {coords['lat']}, {coords['lon']}
- Display Name: {coords.get('display_name', request.destination)}

WEATHER FORECAST:
{self._format_weather_summary(weather_data)}

AVAILABLE ATTRACTIONS ({len(pois)} found):
{self._format_pois_list(pois[:30])}

TASK:
Create a balanced day-by-day itinerary with {activities_per_day} activities per day (morning/afternoon/evening).
Consider weather conditions, mix indoor/outdoor activities, and stay within budget.

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, no text before or after.
Use double quotes for all strings. No trailing commas. Numbers without quotes.

Return in this exact format:
{{
    "destination_info": {{
        "name": "{request.destination}",
        "coordinates": {{"lat": {coords['lat']}, "lon": {coords['lon']}}},
        "weather_summary": "brief weather summary"
    }},
    "daily_itineraries": [
        {{
            "day": 1,
            "date": "{request.start_date}",
            "activities": [
                {{
                    "time_of_day": "morning",
                    "name": "Activity Name",
                    "description": "What to do",
                    "duration": "2 hours",
                    "estimated_cost": 25.00,
                    "location": "Specific place"
                }}
            ],
            "total_daily_cost": 75.00,
            "notes": "Weather or special notes"
        }}
    ],
    "recommendations": {{
        "weather_tips": ["tip1", "tip2"],
        "alternate_activities": ["activity1", "activity2"],
        "local_tips": ["tip1", "tip2"]
    }}
}}"""
            
            # Single LLM call to format itinerary
            logger.info("Making single LLM call to format itinerary...")
            response = llm.invoke(prompt)
            
            # Parse JSON response
            import json
            import re
            response_text = response.content.strip()
            
            # Extract JSON from markdown code blocks if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
            
            # Clean up common JSON issues
            # Remove trailing commas before closing braces/brackets
            response_text = re.sub(r',(\s*[}\]])', r'\1', response_text)
            # Replace single quotes with double quotes (but not in strings)
            # Note: This is a simple fix, not perfect for all cases
            
            try:
                agent_response = json.loads(response_text)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse LLM JSON response. Error: {e}")
                logger.error(f"LLM Response (first 1000 chars): {response_text[:1000]}")
                # Try to salvage by asking LLM to fix it
                fix_prompt = f"""The following JSON is invalid. Fix it and return ONLY valid JSON with no markdown or explanation:

{response_text[:3000]}

Error: {str(e)}

Return corrected JSON:"""
                fix_response = llm.invoke(fix_prompt)
                fix_text = fix_response.content.strip()
                if "```json" in fix_text:
                    fix_text = fix_text.split("```json")[1].split("```")[0].strip()
                elif "```" in fix_text:
                    fix_text = fix_text.split("```")[1].split("```")[0].strip()
                fix_text = re.sub(r',(\s*[}\]])', r'\1', fix_text)
                agent_response = json.loads(fix_text)
            
            # Format the response
            trip_response = self._format_response(
                request=request,
                agent_response=agent_response,
                coords=coords,
                weather_data=weather_data,
                duration=duration,
                daily_budget=daily_budget,
                date_range=date_range
            )
            
            logger.info("Trip planning completed successfully (FAST MODE)")
            return trip_response
            
        except Exception as e:
            logger.error(f"Error planning trip in fast mode: {e}")
            raise
    
    async def plan_trip_agent(self, request: TripRequest) -> TripResponse:
        """
        Agent mode: Full ReAct pattern with multiple tool calls.
        More thorough but slower with 5-8 LLM calls.
        
        Args:
            request: Validated trip request
        
        Returns:
            Complete trip response with itinerary
        """
        try:
            logger.info(f"Planning trip to {request.destination} (AGENT MODE)")
            
            # Calculate basic trip metrics
            duration = calculate_trip_duration(request.start_date, request.end_date)
            daily_budget = calculate_daily_budget(request.budget, duration)
            date_range = get_date_range(request.start_date, request.end_date)
            
            # Get destination coordinates and weather
            coords = await api_service.get_coordinates(request.destination)
            if not coords:
                raise ValueError(f"Could not find location: {request.destination}")
            
            weather_data = await api_service.get_weather_forecast(
                coords['lat'],
                coords['lon'],
                request.start_date,
                request.end_date
            )
            
            # Prepare request for agent
            agent_request = {
                "destination": request.destination,
                "start_date": request.start_date,
                "end_date": request.end_date,
                "budget": request.budget,
                "travelers": request.travelers,
                "interests": request.interests,
                "pace": request.pace
            }
            
            # Run the agent to create itinerary
            agent_response = self.agent.plan_trip(agent_request)
            
            # Format the response
            trip_response = self._format_response(
                request=request,
                agent_response=agent_response,
                coords=coords,
                weather_data=weather_data,
                duration=duration,
                daily_budget=daily_budget,
                date_range=date_range
            )
            
            logger.info("Trip planning completed successfully")
            return trip_response
            
        except Exception as e:
            logger.error(f"Error planning trip: {e}")
            raise
    
    def _format_response(
        self,
        request: TripRequest,
        agent_response: Dict[str, Any],
        coords: Dict[str, float],
        weather_data: Dict[str, Any],
        duration: int,
        daily_budget: float,
        date_range: list
    ) -> TripResponse:
        """Format agent response into structured TripResponse."""
        
        # Create trip overview
        weather_summary = self._generate_weather_summary(weather_data)
        
        overview = TripOverview(
            destination=request.destination,
            duration=duration,
            start_date=request.start_date,
            end_date=request.end_date,
            total_budget=request.budget,
            daily_budget=daily_budget,
            travelers=request.travelers,
            weather_summary=weather_summary,
            coordinates={
                "lat": coords['lat'],
                "lon": coords['lon']
            }
        )
        
        # Format daily itineraries
        itinerary = self._format_itineraries(
            agent_response,
            date_range,
            weather_data
        )
        
        # Generate smart additions
        avg_temp = self._calculate_avg_temperature(weather_data)
        smart_additions = self._generate_smart_additions(
            weather_data=weather_data,
            avg_temp=avg_temp,
            duration=duration,
            agent_recommendations=agent_response.get('recommendations', {})
        )
        
        return TripResponse(
            status="success",
            overview=overview,
            itinerary=itinerary,
            smart_additions=smart_additions,
            metadata={
                "generated_at": datetime.now().isoformat(),
                "agent_used": "langchain_react",
                "tools_available": ["coordinates", "weather", "poi", "route"]
            }
        )
    
    def _format_itineraries(
        self,
        agent_response: Dict[str, Any],
        date_range: list,
        weather_data: Dict[str, Any]
    ) -> list[DayItinerary]:
        """Format daily itineraries from agent response."""
        itineraries = []
        
        daily_plans = agent_response.get('daily_itineraries', [])
        
        for i, date in enumerate(date_range):
            day_num = i + 1
            
            # Find matching day from agent response
            day_data = next(
                (d for d in daily_plans if d.get('day') == day_num),
                None
            )
            
            if day_data:
                activities = day_data.get('activities', [])
                
                # Extract activities by time of day
                morning_act = self._find_activity(activities, 'morning') or self._create_default_activity('morning')
                afternoon_act = self._find_activity(activities, 'afternoon') or self._create_default_activity('afternoon')
                evening_act = self._find_activity(activities, 'evening') or self._create_default_activity('evening')
                
                total_cost = sum([
                    morning_act.estimated_cost,
                    afternoon_act.estimated_cost,
                    evening_act.estimated_cost
                ])
                
                # Get weather for this day
                weather_desc = self._get_weather_for_day(weather_data, i)
                
                day_itinerary = DayItinerary(
                    day=day_num,
                    date=date,
                    morning=morning_act,
                    afternoon=afternoon_act,
                    evening=evening_act,
                    total_cost=round(total_cost, 2),
                    travel_time="30-60 minutes between activities",
                    weather=weather_desc,
                    notes=day_data.get('notes', f"Day {day_num} in your adventure!")
                )
                
                itineraries.append(day_itinerary)
            else:
                # Create default itinerary if agent didn't provide one
                itineraries.append(self._create_default_day_itinerary(day_num, date))
        
        return itineraries
    
    def _find_activity(self, activities: list, time_of_day: str) -> Activity:
        """Find activity for specific time of day."""
        for act in activities:
            if act.get('time_of_day', '').lower() == time_of_day.lower():
                return Activity(
                    name=act.get('name', 'Activity'),
                    description=act.get('description', 'Enjoy your time'),
                    duration=act.get('duration', '2-3 hours'),
                    estimated_cost=float(act.get('estimated_cost', 30.0)),
                    location=act.get('location'),
                    time_of_day=time_of_day
                )
        return None
    
    def _create_default_activity(self, time_of_day: str) -> Activity:
        """Create a default activity."""
        defaults = {
            'morning': Activity(
                name="Morning Exploration",
                description="Start your day with local breakfast and explore the neighborhood",
                duration="2-3 hours",
                estimated_cost=25.0,
                time_of_day="morning"
            ),
            'afternoon': Activity(
                name="Afternoon Adventure",
                description="Visit local attractions and enjoy lunch at a recommended restaurant",
                duration="3-4 hours",
                estimated_cost=45.0,
                time_of_day="afternoon"
            ),
            'evening': Activity(
                name="Evening Experience",
                description="Enjoy dinner and evening atmosphere of the city",
                duration="2-3 hours",
                estimated_cost=35.0,
                time_of_day="evening"
            )
        }
        return defaults.get(time_of_day, defaults['morning'])
    
    def _create_default_day_itinerary(self, day: int, date: str) -> DayItinerary:
        """Create default day itinerary as fallback."""
        return DayItinerary(
            day=day,
            date=date,
            morning=self._create_default_activity('morning'),
            afternoon=self._create_default_activity('afternoon'),
            evening=self._create_default_activity('evening'),
            total_cost=105.0,
            travel_time="30-60 minutes between activities",
            notes=f"Explore and enjoy day {day}!"
        )
    
    def _generate_weather_summary(self, weather_data: Dict[str, Any]) -> str:
        """Generate human-readable weather summary."""
        if not weather_data or 'daily' not in weather_data:
            return "Weather data unavailable"
        
        daily = weather_data['daily']
        temps_max = daily.get('temperature_2m_max', [])
        temps_min = daily.get('temperature_2m_min', [])
        
        if temps_max and temps_min:
            avg_high = sum(temps_max) / len(temps_max)
            avg_low = sum(temps_min) / len(temps_min)
            return f"Expected temperatures: {avg_low:.1f}°C to {avg_high:.1f}°C. Pack accordingly!"
        
        return "Mild weather expected"
    
    def _calculate_avg_temperature(self, weather_data: Dict[str, Any]) -> float:
        """Calculate average temperature."""
        if not weather_data or 'daily' not in weather_data:
            return 20.0  # Default
        
        daily = weather_data['daily']
        temps_max = daily.get('temperature_2m_max', [20])
        temps_min = daily.get('temperature_2m_min', [15])
        
        all_temps = temps_max + temps_min
        return sum(all_temps) / len(all_temps) if all_temps else 20.0
    
    def _get_weather_for_day(self, weather_data: Dict[str, Any], day_index: int) -> str:
        """Get weather description for specific day."""
        if not weather_data or 'daily' not in weather_data:
            return "Weather data unavailable"
        
        daily = weather_data['daily']
        weather_codes = daily.get('weathercode', [])
        temps_max = daily.get('temperature_2m_max', [])
        temps_min = daily.get('temperature_2m_min', [])
        
        if day_index < len(weather_codes):
            code = weather_codes[day_index]
            condition = api_service.interpret_weather_code(code)
            
            temp_desc = ""
            if day_index < len(temps_max) and day_index < len(temps_min):
                temp_desc = f" {temps_min[day_index]:.0f}°C - {temps_max[day_index]:.0f}°C"
            
            return f"{condition}{temp_desc}"
        
        return "Mild weather expected"
    
    def _generate_smart_additions(
        self,
        weather_data: Dict[str, Any],
        avg_temp: float,
        duration: int,
        agent_recommendations: Dict[str, Any]
    ) -> SmartAdditions:
        """Generate smart additions and recommendations."""
        
        # Packing list
        packing_list = generate_packing_list(avg_temp, duration)
        
        # Weather tips
        weather_tips = []
        if avg_temp < 10:
            weather_tips.extend([
                "Dress in layers for cold weather",
                "Indoor attractions recommended for warmth",
                "Hot beverages will be welcome"
            ])
        elif avg_temp > 25:
            weather_tips.extend([
                "Stay hydrated throughout the day",
                "Use sunscreen and wear a hat",
                "Plan indoor activities during peak heat hours"
            ])
        else:
            weather_tips.extend([
                "Comfortable weather for outdoor activities",
                "Light jacket recommended for evenings",
                "Great conditions for walking tours"
            ])
        
        # Get recommendations from agent or use defaults
        alternate_activities = agent_recommendations.get('alternate_activities', [
            "Visit local markets for authentic experiences",
            "Take a food tour to sample local cuisine",
            "Join a walking tour for historical insights"
        ])
        
        local_tips = agent_recommendations.get('local_tips', [
            "Learn a few local phrases - locals appreciate the effort",
            "Try local specialties at neighborhood restaurants",
            "Use public transportation to experience local life",
            "Visit during early morning for fewer crowds"
        ])
        
        return SmartAdditions(
            packing_list=packing_list[:10],  # Limit to 10 items
            weather_tips=weather_tips,
            alternate_activities=alternate_activities[:5],
            local_tips=local_tips[:5]
        )
    
    def _format_weather_summary(self, weather_data: Dict[str, Any]) -> str:
        """Format weather data for LLM prompt."""
        if not weather_data or 'daily' not in weather_data:
            return "Weather data unavailable"
        
        daily = weather_data.get('daily', {})
        dates = daily.get('time', [])
        temp_max = daily.get('temperature_2m_max', [])
        temp_min = daily.get('temperature_2m_min', [])
        precip = daily.get('precipitation_sum', [])
        
        summary = []
        for i, date in enumerate(dates):
            if i < len(temp_max):
                summary.append(
                    f"  {date}: {temp_min[i]:.1f}°C - {temp_max[i]:.1f}°C, "
                    f"Rain: {precip[i]:.1f}mm"
                )
        
        return "\n".join(summary) if summary else "Moderate temperatures expected"
    
    def _format_pois_list(self, pois: list) -> str:
        """Format POIs for LLM prompt."""
        if not pois:
            return "  (Use well-known attractions for this city)"
        
        formatted = []
        for poi in pois[:20]:  # Limit to 20 to keep prompt size reasonable
            name = poi.get('name', 'Unknown')
            poi_type = poi.get('type', 'attraction')
            formatted.append(f"  - {name} ({poi_type})")
        
        return "\n".join(formatted)


# Global service instance
trip_service = TripService()
