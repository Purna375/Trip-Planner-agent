"""
LangChain agent for intelligent trip planning.
Uses ReAct pattern with tools to gather information and create itineraries.
"""
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from agents.tools import trip_planning_tools
from utils.config import settings
from typing import Dict, Any
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TripPlanningAgent:
    """
    Agentic AI system for trip planning using LangChain.
    Uses multiple tools to gather data and reason about creating optimal itineraries.
    """
    
    def __init__(self):
        """Initialize the agent with LLM and tools."""
        self.llm = ChatGroq(
            model=settings.llm_model,
            temperature=settings.llm_temperature,
            groq_api_key=settings.groq_api_key
        )
        
        self.tools = trip_planning_tools
        
        # Create system prompt for the agent
        system_prompt = self._create_system_prompt()
        
        # Create the agent using LangGraph
        self.agent_executor = create_react_agent(
            model=self.llm,
            tools=self.tools,
            prompt=system_prompt
        )
    
    def _create_system_prompt(self) -> str:
        """Create the system prompt for the agent."""
        return """You are an expert AI travel planner. Create detailed, personalized travel itineraries efficiently.

WORKFLOW (Complete in 3-4 steps):
1. Call get_coordinates ONCE for destination
2. Call get_weather ONCE for date range  
3. Call get_points_of_interest ONCE with all interests comma-separated
4. Create itinerary from gathered data - DO NOT call tools again

Travel pace: relaxed=2 activities/day, balanced=3 activities/day, packed=4+ activities/day

FINAL ANSWER FORMAT (must be valid JSON):
{
    "destination_info": {
        "name": "city name",
        "coordinates": {"lat": 0.0, "lon": 0.0},
        "weather_summary": "brief summary"
    },
    "daily_itineraries": [
        {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
                {
                    "time_of_day": "morning/afternoon/evening",
                    "name": "activity name",
                    "description": "brief description",
                    "duration": "X hours",
                    "estimated_cost": 0.00,
                    "location": "place name"
                }
            ],
            "total_daily_cost": 0.00,
            "notes": "optional day notes"
        }
    ],
    "recommendations": {
        "weather_tips": ["tip1", "tip2"],
        "alternate_activities": ["alt1", "alt2"],
        "local_tips": ["tip1", "tip2"]
    }
}

Respond with only the JSON object in your final answer."""
    
    def plan_trip(self, trip_request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Plan a trip based on user requirements.
        
        Args:
            trip_request: Dictionary with trip parameters
        
        Returns:
            Structured trip plan
        """
        # Construct the input question for the agent
        question = f"""
        Create a detailed trip itinerary with these requirements:
        
        Destination: {trip_request['destination']}
        Dates: {trip_request['start_date']} to {trip_request['end_date']}
        Budget: ${trip_request['budget']} total
        Travelers: {trip_request['travelers']}
        Interests: {', '.join(trip_request['interests'])}
        Travel Pace: {trip_request['pace']}
        
        Use the tools to gather information about the destination, weather, and attractions.
        Then create a comprehensive day-by-day itinerary that matches these preferences.
        Consider the weather forecast and adjust activities accordingly.
        Make sure the total cost stays within the budget.
        """
        
        try:
            logger.info(f"Starting trip planning for {trip_request['destination']}")
            
            # Run the agent with LangGraph API (using messages)
            result = self.agent_executor.invoke({
                "messages": [HumanMessage(content=question)]
            })
            
            # Extract the last message from the agent
            if "messages" in result and len(result["messages"]) > 0:
                output = result["messages"][-1].content
            else:
                output = str(result)
            
            # Try to parse JSON from the output
            trip_plan = self._parse_agent_output(output)
            
            logger.info("Trip planning completed successfully")
            return trip_plan
            
        except Exception as e:
            logger.error(f"Error in trip planning: {e}")
            raise Exception(f"Failed to plan trip: {str(e)}")
    
    def _parse_agent_output(self, output: str) -> Dict[str, Any]:
        """
        Parse the agent's output to extract structured JSON.
        
        Args:
            output: Agent output string
        
        Returns:
            Parsed JSON dictionary
        """
        # Try to find JSON in the output
        try:
            # Look for JSON block
            start_idx = output.find('{')
            end_idx = output.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = output[start_idx:end_idx]
                return json.loads(json_str)
            else:
                # If no JSON found, return the raw output
                return {
                    "destination_info": {"name": "Unknown"},
                    "daily_itineraries": [],
                    "recommendations": {},
                    "raw_output": output
                }
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse agent output as JSON: {e}")
            return {
                "destination_info": {"name": "Unknown"},
                "daily_itineraries": [],
                "recommendations": {},
                "raw_output": output,
                "parse_error": str(e)
            }


# Global agent instance
trip_agent = None

def get_trip_agent() -> TripPlanningAgent:
    """Get or create the global trip planning agent instance."""
    global trip_agent
    if trip_agent is None:
        trip_agent = TripPlanningAgent()
    return trip_agent
