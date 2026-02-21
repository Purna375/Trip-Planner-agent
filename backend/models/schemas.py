"""
Pydantic models for request/response validation.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime


class TripRequest(BaseModel):
    """Schema for trip planning request."""
    
    destination: str = Field(..., description="City or country name", min_length=2)
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    budget: float = Field(..., ge=0, description="Total budget in USD")
    travelers: int = Field(..., ge=1, le=20, description="Number of travelers")
    interests: List[str] = Field(
        default=["culture", "local_life"],
        description="List of interests"
    )
    pace: str = Field(
        default="balanced",
        description="Travel pace: relaxed, balanced, or packed"
    )
    
    @validator('start_date', 'end_date')
    def validate_date_format(cls, v):
        """Validate date format."""
        try:
            datetime.strptime(v, "%Y-%m-%d")
            return v
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
    
    @validator('end_date')
    def validate_end_after_start(cls, v, values):
        """Validate end date is after start date."""
        if 'start_date' in values:
            start = datetime.strptime(values['start_date'], "%Y-%m-%d")
            end = datetime.strptime(v, "%Y-%m-%d")
            if end < start:
                raise ValueError("End date must be after start date")
        return v
    
    @validator('pace')
    def validate_pace(cls, v):
        """Validate pace value."""
        valid_paces = ['relaxed', 'balanced', 'packed']
        if v.lower() not in valid_paces:
            raise ValueError(f"Pace must be one of {valid_paces}")
        return v.lower()
    
    @validator('interests')
    def validate_interests(cls, v):
        """Validate interests list."""
        if not v:
            return ["culture", "local_life"]
        return [interest.lower().strip() for interest in v]


class Activity(BaseModel):
    """Schema for a single activity."""
    
    name: str
    description: str
    duration: str
    estimated_cost: float
    location: Optional[str] = None
    time_of_day: str  # morning, afternoon, evening


class DayItinerary(BaseModel):
    """Schema for a single day's itinerary."""
    
    day: int
    date: str
    morning: Activity
    afternoon: Activity
    evening: Activity
    total_cost: float
    travel_time: str
    weather: Optional[str] = None
    notes: Optional[str] = None


class TripOverview(BaseModel):
    """Schema for trip overview."""
    
    destination: str
    duration: int
    start_date: str
    end_date: str
    total_budget: float
    daily_budget: float
    travelers: int
    weather_summary: str
    coordinates: Optional[Dict[str, float]] = None


class SmartAdditions(BaseModel):
    """Schema for smart additions and recommendations."""
    
    packing_list: List[str]
    weather_tips: List[str]
    alternate_activities: List[str]
    local_tips: List[str]


class TripResponse(BaseModel):
    """Schema for complete trip planning response."""
    
    status: str = "success"
    overview: TripOverview
    itinerary: List[DayItinerary]
    smart_additions: SmartAdditions
    metadata: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    
    status: str = "error"
    message: str
    details: Optional[Dict[str, Any]] = None
