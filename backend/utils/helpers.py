"""
Helper utility functions for date handling, formatting, and calculations.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any
import re


def parse_date(date_string: str) -> datetime:
    """
    Parse date string in various formats.
    
    Args:
        date_string: Date in format 'YYYY-MM-DD'
    
    Returns:
        datetime object
    """
    try:
        return datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Date must be in YYYY-MM-DD format")


def calculate_trip_duration(start_date: str, end_date: str) -> int:
    """
    Calculate number of days between start and end date.
    
    Args:
        start_date: Start date string
        end_date: End date string
    
    Returns:
        Number of days
    """
    start = parse_date(start_date)
    end = parse_date(end_date)
    duration = (end - start).days + 1  # Include both start and end day
    return max(1, duration)


def format_currency(amount: float) -> str:
    """Format amount as currency."""
    return f"${amount:.2f}"


def format_duration(minutes: int) -> str:
    """
    Format duration in minutes to human-readable format.
    
    Args:
        minutes: Duration in minutes
    
    Returns:
        Formatted string like "2h 30min"
    """
    hours = minutes // 60
    mins = minutes % 60
    
    if hours > 0 and mins > 0:
        return f"{hours}h {mins}min"
    elif hours > 0:
        return f"{hours}h"
    else:
        return f"{mins}min"


def get_date_range(start_date: str, end_date: str) -> List[str]:
    """
    Generate list of dates between start and end date.
    
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
    
    Returns:
        List of date strings
    """
    start = parse_date(start_date)
    end = parse_date(end_date)
    
    dates = []
    current = start
    while current <= end:
        dates.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)
    
    return dates


def calculate_daily_budget(total_budget: float, duration: int) -> float:
    """
    Calculate daily budget allocation.
    
    Args:
        total_budget: Total trip budget
        duration: Number of days
    
    Returns:
        Daily budget
    """
    if duration <= 0:
        return 0.0
    return total_budget / duration


def clean_text(text: str) -> str:
    """
    Clean and normalize text by removing extra whitespace and special characters.
    
    Args:
        text: Input text
    
    Returns:
        Cleaned text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text


def generate_packing_list(weather_avg: float, duration: int) -> List[str]:
    """
    Generate basic packing suggestions based on weather.
    
    Args:
        weather_avg: Average temperature in Celsius
        duration: Trip duration in days
    
    Returns:
        List of packing suggestions
    """
    packing = []
    
    # Temperature-based suggestions
    if weather_avg < 10:
        packing.extend(["Warm jacket", "Sweaters", "Long pants", "Gloves", "Scarf"])
    elif weather_avg < 20:
        packing.extend(["Light jacket", "Long pants", "Light sweater"])
    else:
        packing.extend(["Light clothing", "Shorts", "T-shirts", "Sunhat"])
    
    # Universal items
    packing.extend([
        "Comfortable walking shoes",
        "Sunscreen",
        "Reusable water bottle",
        "Phone charger",
        "Travel adapter",
        "Personal medications",
        "Travel documents"
    ])
    
    return packing


def validate_interests(interests: List[str]) -> List[str]:
    """
    Validate and normalize user interests.
    
    Args:
        interests: List of interest strings
    
    Returns:
        Validated list of interests
    """
    valid_interests = [
        "culture", "history", "food", "nature", "adventure",
        "museums", "art", "shopping", "nightlife", "beaches",
        "architecture", "photography", "hiking", "local_life"
    ]
    
    normalized = []
    for interest in interests:
        normalized_interest = interest.lower().strip()
        if normalized_interest in valid_interests:
            normalized.append(normalized_interest)
    
    return normalized if normalized else ["culture", "local_life"]
