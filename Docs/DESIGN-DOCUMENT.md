# Design Document
# AI Trip Planner Agent System

**Version:** 1.0  
**Date:** February 25, 2026  
**Status:** Final  
**Author:** Development Team  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [System Architecture](#3-system-architecture)
4. [Data Design](#4-data-design)
5. [Component Design](#5-component-design)
6. [Interface Design](#6-interface-design)
7. [API Design](#7-api-design)
8. [Security Design](#8-security-design)
9. [Performance Considerations](#9-performance-considerations)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Error Handling Strategy](#11-error-handling-strategy)
12. [Testing Strategy](#12-testing-strategy)
13. [Appendices](#13-appendices)

---

## 1. Introduction

### 1.1 Purpose

This design document provides a comprehensive technical blueprint for the AI Trip Planner Agent system. It describes the architecture, components, interfaces, data structures, and design decisions that guide the implementation of this intelligent travel itinerary generation system.

**Target Audience:**
- Software architects and senior developers
- Backend and frontend development teams
- DevOps and infrastructure engineers
- Technical leads and system integrators
- Quality assurance and testing teams

### 1.2 Scope

This document covers the complete technical design of an AI-powered trip planning system that leverages LangChain agents with the ReAct (Reasoning + Acting) pattern to generate personalized travel itineraries.

**System Capabilities:**
- AI agent orchestration using LangChain framework
- Integration with external APIs (Groq, OpenStreetMap, Open-Meteo, Overpass, OpenRouteService)
- Real-time data aggregation and processing
- Structured itinerary generation with budget tracking
- Responsive web interface with modern UX
- RESTful API with FastAPI framework

**Technology Stack:**
- **Backend:** Python 3.9+, FastAPI, LangChain, Pydantic
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **AI/LLM:** Groq API with Llama 3.1 models
- **External APIs:** OpenStreetMap, Open-Meteo, Overpass API, OpenRouteService
- **Deployment:** Docker, Cloud platforms (AWS/Azure/GCP)

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **Agent** | Autonomous AI system that reasons and uses tools |
| **ReAct** | Reasoning + Acting pattern for AI agents |
| **LangChain** | Framework for building LLM-powered applications |
| **Groq** | Ultra-fast AI inference platform |
| **POI** | Point of Interest (tourist attractions, restaurants, etc.) |
| **Nominatim** | OpenStreetMap's geocoding service |
| **Overpass** | OpenStreetMap's query API for POI data |
| **FastAPI** | Modern Python web framework for building APIs |
| **Pydantic** | Data validation library using Python type hints |
| **CORS** | Cross-Origin Resource Sharing |
| **LLM** | Large Language Model |
| **REST** | Representational State Transfer |

### 1.4 Design Goals

1. **Performance:** Generate complete itineraries in under 60 seconds
2. **Scalability:** Support concurrent users without performance degradation
3. **Reliability:** Graceful handling of external API failures with fallbacks
4. **Maintainability:** Modular architecture with clear separation of concerns
5. **Usability:** Intuitive interface with real-time feedback
6. **Security:** Secure API key management and input validation
7. **Extensibility:** Easy addition of new tools and features

### 1.5 References

- Software Requirements Specification (SRS-Document.md)
- Architecture Documentation (ARCHITECTURE.md)
- API Documentation (FastAPI /docs endpoint)
- LangChain Documentation: https://python.langchain.com/
- Groq API Docs: https://console.groq.com/docs
- FastAPI Documentation: https://fastapi.tiangolo.com/

---

## 2. System Overview

### 2.1 System Context

The AI Trip Planner is a standalone web-based application that integrates with multiple external services to provide intelligent travel planning capabilities. The system acts as an intermediary between users and various data sources, leveraging AI to synthesize information into coherent travel itineraries.

**System Context Diagram:**

![System Context Diagram](system-context-diagram.png)

*(See appendix for PlantUML code)*

### 2.2 High-Level Architecture

The system follows a three-tier architecture:

1. **Presentation Layer (Frontend)**
   - Single-page web application
   - Responsive UI for desktop and mobile
   - Client-side validation and state management

2. **Application Layer (Backend)**
   - FastAPI REST API server
   - AI agent orchestration with LangChain
   - Business logic and data processing
   - External API integration

3. **Data Layer (External Services)**
   - Groq API for LLM inference
   - OpenStreetMap for geocoding and POI data
   - Open-Meteo for weather forecasts
   - OpenRouteService for route optimization

**High-Level Architecture Diagram:**

![High-Level Architecture](high-level-architecture-diagram.png)

*(See appendix for PlantUML code)*

### 2.3 Key Design Patterns

#### 2.3.1 ReAct Agent Pattern

The core of the system uses the ReAct (Reasoning + Acting) pattern for AI agents:

```
Thought: Analyze what information is needed
Action: Call a tool to gather data
Observation: Process tool output
... (repeat as needed)
Final Answer: Synthesize structured itinerary
```

#### 2.3.2 Service Layer Pattern

Business logic is separated into service layers:
- `trip_service.py`: Orchestrates trip planning workflow
- `api_service.py`: Manages external API calls
- Clear separation between routes (controllers) and services

#### 2.3.3 Repository Pattern

External API calls are abstracted through a service layer, making it easy to:
- Mock services for testing
- Add caching layers
- Implement retry logic
- Switch API providers

#### 2.3.4 Strategy Pattern

The system uses strategy pattern for different trip planning approaches:
- Fast mode (direct API calls with LLM formatting)
- Agent mode (ReAct pattern with tool usage)
- Configurable via settings or request parameters

---

## 3. System Architecture

### 3.1 Architectural Style

The system implements a **Layered Architecture** with **Microservices principles**:

- **Separation of Concerns:** Frontend, backend, and external services are clearly separated
- **Stateless Design:** No server-side session management
- **API-First:** RESTful API as the primary interface
- **Cloud-Native:** Containerized for easy deployment

### 3.2 Component Architecture

**Complete System Architecture:**

![Component Architecture](component-architecture-diagram.png)

*(See appendix for PlantUML code)*

#### 3.2.1 Frontend Components

**1. index.html**
- Trip planning form
- Loading state UI
- Results display area
- Error handling UI

**2. app.js**
- Form submission handler
- State management (currentTrip, isLoading)
- UI controller (showSection, displayResults)
- Loading animation controller
- PDF generation

**3. api.js**
- HTTP client wrapper
- API endpoint calls
- Error handling
- Request/response transformation

**4. styles.css**
- Professional design system
- Responsive layouts
- Component styling
- Animations and transitions

#### 3.2.2 Backend Components

**1. main.py**
- FastAPI application initialization
- CORS configuration
- Route registration
- Global exception handling
- Startup/shutdown events

**2. routes/trip_planner.py**
- `/api/plan-trip` endpoint
- `/api/health` endpoint
- Request validation
- Response formatting

**3. services/trip_service.py**
- `plan_trip()`: Main orchestration method
- `plan_trip_fast()`: Fast mode implementation
- Response formatting
- Business logic coordination

**4. services/api_service.py**
- `get_coordinates()`: Geocoding via Nominatim
- `get_weather_forecast()`: Weather data via Open-Meteo
- `get_points_of_interest()`: POI search via Overpass
- `get_route_info()`: Route calculation via OpenRouteService
- HTTP client management
- Error handling and retries

**5. agents/trip_agent.py**
- LangChain agent initialization
- ReAct pattern implementation
- Tool registration and management
- Agent prompt engineering
- Response parsing

**6. agents/tools.py**
- Tool definitions for LangChain
- Input/output schemas
- Tool execution logic
- Async-to-sync wrappers

**7. models/schemas.py**
- Pydantic models for validation
- Request schemas (TripRequest)
- Response schemas (TripResponse, DayItinerary, Activity)
- Validation rules

**8. utils/config.py**
- Environment variable management
- Settings class with defaults
- API endpoint configuration
- Feature flags

**9. utils/helpers.py**
- Date calculations
- Budget allocation
- Distance calculations (Haversine)
- Common utilities

### 3.3 Data Flow Architecture

**Request/Response Flow:**

![Data Flow Diagram](data-flow-diagram.png)

*(See appendix for PlantUML code)*

**Flow Description:**

1. **User Input (Frontend)**
   - User fills trip planning form
   - Client-side validation
   - Form data serialization

2. **API Request (Frontend → Backend)**
   - POST request to `/api/plan-trip`
   - JSON payload with trip parameters
   - CORS headers included

3. **Request Processing (Backend)**
   - FastAPI receives and validates request
   - Pydantic model validation
   - Route handler invoked

4. **Trip Planning Orchestration**
   - trip_service.plan_trip() called
   - Calculate trip metrics (duration, daily budget)
   - Parallel external API calls

5. **External Data Collection**
   - Geocoding (Nominatim)
   - Weather forecast (Open-Meteo)
   - Points of interest (Overpass)
   - Route information (OpenRouteService with fallback)

6. **AI Agent Processing** (Optional)
   - LangChain agent initialized
   - ReAct pattern execution
   - Tool calls for data gathering
   - LLM synthesis via Groq

7. **Response Generation**
   - Format daily itineraries
   - Calculate costs and timings
   - Generate recommendations
   - Validate response schema

8. **API Response (Backend → Frontend)**
   - JSON response with complete itinerary
   - HTTP 200 on success
   - Error codes (400, 500) on failures

9. **Results Display (Frontend)**
   - Parse JSON response
   - Render UI components
   - Display itinerary cards
   - Enable download/print

### 3.4 Deployment Architecture

**Deployment View:**

![Deployment Architecture](deployment-architecture-diagram.png)

*(See appendix for PlantUML code)*

**Components:**

1. **Client Browser**
   - HTML/CSS/JS files
   - State management
   - API communication

2. **Application Server**
   - Docker container with Python 3.9+
   - FastAPI with Uvicorn ASGI server
   - Environment variables for configuration
   - 2GB+ RAM, 2+ CPU cores

3. **External Services**
   - Groq API (HTTPS)
   - OpenStreetMap services (HTTPS)
   - Open-Meteo (HTTPS)
   - OpenRouteService (HTTPS, optional)

4. **Cloud Platform** (AWS/Azure/GCP)
   - Load balancer
   - Auto-scaling groups
   - CDN for static files
   - Monitoring and logging

---

## 4. Data Design

### 4.1 Data Models

**Data Model Diagram:**

![Data Models](data-models-diagram.png)

*(See appendix for PlantUML code)*

### 4.2 Request Schemas

#### 4.2.1 TripRequest

```python
class TripRequest(BaseModel):
    destination: str          # City or location name (min 2 chars)
    start_date: str          # YYYY-MM-DD format
    end_date: str            # YYYY-MM-DD format
    budget: float            # Total budget in USD (>= 100)
    travelers: int           # Number of travelers (1-20)
    interests: List[str]     # e.g., ["culture", "food", "museums"]
    pace: str                # "relaxed", "balanced", or "packed"
```

**Validation Rules:**
- `start_date` must be >= today
- `end_date` must be > `start_date`
- Trip duration: 1-14 days
- `budget` >= 100
- `travelers` between 1 and 20
- `pace` must be in allowed values

**Example:**
```json
{
  "destination": "Paris, France",
  "start_date": "2026-06-15",
  "end_date": "2026-06-18",
  "budget": 1500.0,
  "travelers": 2,
  "interests": ["culture", "food", "museums", "architecture"],
  "pace": "balanced"
}
```

### 4.3 Response Schemas

#### 4.3.1 TripResponse

```python
class TripResponse(BaseModel):
    overview: TripOverview               # Trip summary
    itinerary: List[DayItinerary]       # Daily plans
    smart_additions: SmartAdditions     # Recommendations
```

#### 4.3.2 TripOverview

```python
class TripOverview(BaseModel):
    destination: str                    # Full destination name
    duration: int                       # Number of days
    start_date: str                     # YYYY-MM-DD
    end_date: str                       # YYYY-MM-DD
    total_budget: float                 # Total budget
    daily_budget: float                 # Budget per day
    travelers: int                      # Number of travelers
    weather_summary: str                # Overall weather description
    coordinates: Dict[str, float]       # {"lat": 48.8566, "lon": 2.3522}
```

#### 4.3.3 DayItinerary

```python
class DayItinerary(BaseModel):
    day: int                    # Day number (1, 2, 3...)
    date: str                   # YYYY-MM-DD
    morning: Activity           # Morning activity
    afternoon: Activity         # Afternoon activity
    evening: Activity           # Evening activity
    weather: str                # Weather description
    travel_time: str            # Estimated travel time
    total_cost: float           # Total cost for the day
    notes: Optional[str]        # Additional notes
```

#### 4.3.4 Activity

```python
class Activity(BaseModel):
    name: str                   # Activity name
    description: str            # Detailed description
    duration: str               # e.g., "2 hours"
    estimated_cost: float       # Cost in USD
    location: Optional[str]     # Location name
    time_of_day: str           # "morning", "afternoon", or "evening"
```

#### 4.3.5 SmartAdditions

```python
class SmartAdditions(BaseModel):
    packing_list: List[str]           # Weather-appropriate items
    weather_tips: List[str]           # Weather-based advice
    alternate_activities: List[str]   # Backup options
    local_tips: List[str]             # Cultural insights
```

### 4.4 External API Data Models

#### 4.4.1 Geocoding Data (Nominatim)

```python
{
    "lat": float,                    # Latitude
    "lon": float,                    # Longitude
    "display_name": str,            # Full formatted address
    "importance": float             # Relevance score
}
```

#### 4.4.2 Weather Data (Open-Meteo)

```python
{
    "daily": {
        "time": List[str],                      # Dates
        "temperature_2m_max": List[float],      # Max temps (°C)
        "temperature_2m_min": List[float],      # Min temps (°C)
        "precipitation_sum": List[float],       # Precipitation (mm)
        "weathercode": List[int]                # Weather codes
    }
}
```

#### 4.4.3 POI Data (Overpass)

```python
{
    "elements": [
        {
            "type": str,              # "node", "way", "relation"
            "id": int,
            "lat": float,
            "lon": float,
            "tags": {
                "name": str,
                "tourism": str,       # Category
                "amenity": str
            }
        }
    ]
}
```

#### 4.4.4 Route Data (OpenRouteService)

```python
{
    "features": [{
        "properties": {
            "summary": {
                "distance": float,    # Meters
                "duration": float     # Seconds
            }
        }
    }]
}
```

### 4.5 Database Design

**Note:** Current version does not use a persistent database. The system is stateless.

**Future Enhancements:**
- User accounts and saved trips (PostgreSQL/MongoDB)
- Trip history and favorites
- Caching layer (Redis)
- Analytics data

**Proposed Schema (Future):**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    destination VARCHAR(255),
    start_date DATE,
    end_date DATE,
    budget DECIMAL,
    itinerary_json JSONB,
    created_at TIMESTAMP
);

-- API cache table
CREATE TABLE api_cache (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    expires_at TIMESTAMP
);
```

---

## 5. Component Design

### 5.1 Frontend Components

#### 5.1.1 Form Component

**Purpose:** Collect user input for trip planning

**Responsibilities:**
- Render input fields (destination, dates, budget, travelers, interests, pace)
- Client-side validation
- Form submission handling
- Error display

**Key Methods:**
```javascript
function validateFormData(formData) {
    // Validate required fields
    // Check date logic
    // Verify budget minimum
    // Return true/false
}

function getFormData() {
    // Extract form values
    // Parse interests array
    // Return formatted object
}

function handleFormSubmit(event) {
    // Prevent default
    // Validate data
    // Call API
    // Handle response/errors
}
```

**UI Elements:**
- Text input: destination
- Date pickers: start_date, end_date
- Number input: budget, travelers
- Checkbox group: interests
- Radio buttons: pace
- Submit button

#### 5.1.2 Loading Component

**Purpose:** Provide visual feedback during processing

**Responsibilities:**
- Display loading spinner
- Show progress bar
- Animate loading steps
- Display status messages

**Key Methods:**
```javascript
function showSection(sectionName) {
    // Hide all sections
    // Show specified section
}

function animateLoadingSteps() {
    // Animate progress bar
    // Update status messages
    // Sequence: "Analyzing..." → "Checking weather..." → "Finding attractions..." → "Optimizing..."
}
```

**UI Elements:**
- Spinner animation
- Progress bar (0-100%)
- Status text
- Loading graphic

#### 5.1.3 Results Component

**Purpose:** Display generated itinerary

**Responsibilities:**
- Render trip overview
- Display daily itineraries
- Show recommendations
- Enable download/print
- Handle "Plan Another Trip" action

**Key Methods:**
```javascript
function displayResults(response) {
    // Render overview
    // Generate itinerary cards
    // Display recommendations
    // Enable actions
}

function createDayCard(dayData) {
    // Create HTML for single day
    // Render activities
    // Show costs and weather
}

function downloadItinerary() {
    // Generate PDF or print view
    // Format for printing
}
```

**UI Elements:**
- Overview card (destination, dates, budget)
- Daily itinerary cards (collapsible)
- Activity cards (morning/afternoon/evening)
- Recommendations grid
- Action buttons (Download, Plan Another)

#### 5.1.4 Error Component

**Purpose:** Display error messages

**Responsibilities:**
- Show user-friendly error messages
- Provide retry option
- Handle different error types

**Key Methods:**
```javascript
function showError(message) {
    // Display error section
    // Set error message
    // Show retry button
}
```

**UI Elements:**
- Error banner
- Error message text
- Retry button
- Dismiss button

### 5.2 Backend Components

#### 5.2.1 Main Application (main.py)

**Purpose:** FastAPI application initialization and configuration

**Responsibilities:**
- Configure FastAPI app
- Set up CORS middleware
- Register routes
- Configure logging
- Handle global exceptions
- Startup/shutdown events

**Key Components:**
```python
app = FastAPI(
    title="AI Trip Planner API",
    description="...",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(CORSMiddleware, ...)
app.include_router(trip_router)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    # Log error
    # Return JSON error response
    pass

@app.on_event("startup")
async def startup_event():
    # Validate configuration
    # Check API keys
    # Log startup info
    pass
```

#### 5.2.2 Route Handler (routes/trip_planner.py)

**Purpose:** Handle HTTP requests and responses

**Responsibilities:**
- Define API endpoints
- Validate requests (Pydantic)
- Call service layer
- Format responses
- Handle HTTP errors

**Endpoints:**
```python
@router.post("/api/plan-trip", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    # Validate Groq API key
    # Call trip_service.plan_trip()
    # Return TripResponse
    # Handle exceptions
    pass

@router.get("/api/health")
async def health_check():
    # Return service health status
    pass

@router.get("/api/sample-request")
async def get_sample_request():
    # Return example request for testing
    pass
```

#### 5.2.3 Trip Service (services/trip_service.py)

**Purpose:** Orchestrate trip planning business logic

**Responsibilities:**
- Coordinate external API calls
- Process and format data
- Calculate trip metrics
- Generate itineraries
- Handle errors and fallbacks

**Key Methods:**
```python
class TripService:
    async def plan_trip(self, request: TripRequest) -> TripResponse:
        # Main orchestration method
        # Call plan_trip_fast()
        # Return formatted response
        pass
    
    async def plan_trip_fast(self, request: TripRequest) -> Dict:
        # Fast mode implementation
        # Parallel API calls
        # LLM-based formatting
        # Return structured data
        pass
    
    def _format_response(self, raw_data, request) -> TripResponse:
        # Format into TripResponse schema
        # Validate structure
        pass
    
    def _calculate_trip_metrics(self, request):
        # Duration, daily budget, date range
        pass
```

**Workflow:**
```
1. Calculate trip duration and daily budget
2. Get destination coordinates (Nominatim)
3. Parallel calls:
   - Get weather forecast (Open-Meteo)
   - Get points of interest (Overpass)
4. Format POI and weather data
5. Send to LLM for itinerary generation
6. Parse and validate LLM response
7. Return TripResponse object
```

#### 5.2.4 API Service (services/api_service.py)

**Purpose:** Manage external API integrations

**Responsibilities:**
- HTTP client management
- API call implementation
- Error handling and retries
- Rate limiting compliance
- Response parsing

**Key Methods:**
```python
class APIService:
    async def get_coordinates(self, location: str) -> Optional[Dict]:
        # Call Nominatim API
        # Parse response
        # Return lat/lon/display_name
        pass
    
    async def get_weather_forecast(self, lat, lon, start_date, end_date) -> Optional[Dict]:
        # Call Open-Meteo API
        # Parse daily forecast
        # Return structured weather data
        pass
    
    async def get_points_of_interest(self, lat, lon, radius, categories) -> List[Dict]:
        # Build Overpass QL query
        # Call Overpass API
        # Parse results
        # Return POI list
        pass
    
    async def get_route_info(self, start_coords, end_coords) -> Optional[Dict]:
        # Call OpenRouteService
        # Fallback to Haversine if unavailable
        # Return distance and duration
        pass
```

**Error Handling:**
- Timeout handling (10 seconds per call)
- Retry logic (3 attempts with exponential backoff)
- Fallback mechanisms (e.g., Haversine for routing)
- Logging all errors

#### 5.2.5 Agent System (agents/trip_agent.py)

**Purpose:** AI agent orchestration using LangChain

**Responsibilities:**
- Initialize LangChain agent
- Configure LLM (Groq)
- Register tools
- Execute ReAct pattern
- Parse agent output

**Key Components:**
```python
class TripPlanningAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.7,
            groq_api_key=settings.groq_api_key
        )
        self.tools = trip_planning_tools
        self.agent_executor = create_react_agent(
            model=self.llm,
            tools=self.tools,
            prompt=system_prompt
        )
    
    def plan_trip(self, trip_request: Dict) -> Dict:
        # Construct user query
        # Invoke agent
        # Parse response
        # Return structured itinerary
        pass
```

**Agent Prompt:**
```
You are an expert AI travel planner. Create detailed, personalized travel itineraries efficiently.

WORKFLOW (Complete in 3-4 steps):
1. Call get_coordinates ONCE for destination
2. Call get_weather ONCE for date range  
3. Call get_points_of_interest ONCE with all interests comma-separated
4. Create itinerary from gathered data - DO NOT call tools again

Travel pace: relaxed=2 activities/day, balanced=3 activities/day, packed=4+ activities/day

FINAL ANSWER FORMAT (must be valid JSON): {...}
```

#### 5.2.6 Agent Tools (agents/tools.py)

**Purpose:** Define tools for LangChain agent

**Responsibilities:**
- Wrap API service calls as LangChain tools
- Define input/output schemas
- Handle async-to-sync execution
- Format tool responses

**Tool Definitions:**
```python
get_coordinates_tool = Tool(
    name="get_coordinates",
    description="Get geographical coordinates for a location",
    func=get_coordinates_tool_func,
    args_schema=CoordinatesInput
)

get_weather_tool = Tool(
    name="get_weather",
    description="Get weather forecast for coordinates and date range",
    func=get_weather_tool_func,
    args_schema=WeatherInput
)

get_poi_tool = Tool(
    name="get_points_of_interest",
    description="Find tourist attractions and points of interest",
    func=get_poi_tool_func,
    args_schema=POIInput
)

calculate_route_tool = Tool(
    name="calculate_route",
    description="Calculate distance and travel time between two points",
    func=calculate_route_tool_func,
    args_schema=RouteInput
)
```

---

## 6. Interface Design

### 6.1 User Interface Design

#### 6.1.1 Design Principles

- **Simplicity:** Clean, uncluttered interface
- **Responsiveness:** Mobile-first design, works on all screen sizes
- **Feedback:** Real-time validation and loading states
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Consistency:** Uniform styling and interaction patterns

#### 6.1.2 Page Layout

**Main Sections:**

1. **Header**
   - App title and logo
   - Tagline: "AI-Powered Travel Planning"

2. **Input Section** (Initial view)
   - Trip planning form
   - Input validation
   - Submit button

3. **Loading Section** (During processing)
   - Loading spinner
   - Progress bar
   - Status messages

4. **Results Section** (After processing)
   - Trip overview card
   - Daily itinerary cards
   - Recommendations grid
   - Action buttons (Download, Plan Another)

5. **Error Section** (On failure)
   - Error message
   - Retry button

**UI Mockup:**

![User Interface Mockup](ui-mockup.png)

*(See appendix for wireframe)*

#### 6.1.3 Form Design

**Input Fields:**

| Field | Type | Validation | Placeholder |
|-------|------|------------|-------------|
| Destination | Text | Required, min 2 chars | "e.g., Paris, France" |
| Start Date | Date | Required, >= today | YYYY-MM-DD |
| End Date | Date | Required, > start_date | YYYY-MM-DD |
| Budget | Number | Required, >= 100 | "e.g., 1500" |
| Travelers | Number | 1-20 | "2" |
| Interests | Checkboxes | At least 1 selected | Multiple options |
| Pace | Radio | One required | "relaxed", "balanced", "packed" |

**Interest Options:**
- Culture & History
- Food & Cuisine
- Museums & Art
- Nature & Outdoors
- Adventure
- Shopping
- Nightlife
- Local Life

#### 6.1.4 Results Display

**Trip Overview Card:**
```
┌─────────────────────────────────────┐
│  Paris, France                      │
│  📍 Coordinates: 48.86°N, 2.35°E    │
│  📅 June 15-18, 2026 (4 days)       │
│  💰 $1,500 total ($375/day)         │
│  👥 2 travelers                      │
│  🌤️ Mostly sunny, 20-24°C           │
└─────────────────────────────────────┘
```

**Daily Itinerary Card:**
```
┌─────────────────────────────────────┐
│  Day 1 - June 15, 2026              │
│  🌤️ Sunny, 23°C                     │
├─────────────────────────────────────┤
│  🌅 MORNING (9:00 AM - 12:00 PM)    │
│  Eiffel Tower Visit                 │
│  Iconic iron lattice tower...       │
│  ⏱️ 3 hours | 💰 $25.00             │
├─────────────────────────────────────┤
│  🌞 AFTERNOON (2:00 PM - 5:00 PM)   │
│  Louvre Museum                      │
│  World's largest art museum...      │
│  ⏱️ 3 hours | 💰 $18.00             │
├─────────────────────────────────────┤
│  🌆 EVENING (7:00 PM - 10:00 PM)    │
│  Seine River Dinner Cruise          │
│  Romantic evening cruise...         │
│  ⏱️ 3 hours | 💰 $85.00             │
├─────────────────────────────────────┤
│  💵 Daily Total: $128.00            │
└─────────────────────────────────────┘
```

**Recommendations Grid:**
```
┌─────────────┬─────────────┬─────────────┐
│ 🎒 Packing  │ 🌤️ Weather  │ 💡 Local    │
│   List      │    Tips     │    Tips     │
├─────────────┼─────────────┼─────────────┤
│ • Sunscreen │ • Sunny     │ • Book      │
│ • Umbrella  │   weather   │   tickets   │
│ • Comfy     │ • Light     │   in        │
│   shoes     │   jacket    │   advance   │
│ • Camera    │   for       │ • Learn     │
│ • Adapter   │   evenings  │   basic     │
│             │             │   French    │
└─────────────┴─────────────┴─────────────┘
```

### 6.2 API Interface Design

#### 6.2.1 REST API Endpoints

**Base URL:** `http://localhost:8000` (development)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/plan-trip` | POST | Generate trip itinerary | None |
| `/api/health` | GET | Health check | None |
| `/api/sample-request` | GET | Get example request | None |
| `/docs` | GET | Interactive API docs | None |
| `/redoc` | GET | Alternative API docs | None |
| `/` | GET | Root info endpoint | None |

#### 6.2.2 API Request/Response Formats

**POST /api/plan-trip**

Request:
```json
{
  "destination": "Paris, France",
  "start_date": "2026-06-15",
  "end_date": "2026-06-18",
  "budget": 1500.0,
  "travelers": 2,
  "interests": ["culture", "food", "museums"],
  "pace": "balanced"
}
```

Response (Success - 200):
```json
{
  "overview": {
    "destination": "Paris, Île-de-France, France",
    "duration": 4,
    "start_date": "2026-06-15",
    "end_date": "2026-06-18",
    "total_budget": 1500.0,
    "daily_budget": 375.0,
    "travelers": 2,
    "weather_summary": "Mostly sunny with temperatures 20-24°C",
    "coordinates": {"lat": 48.8566, "lon": 2.3522}
  },
  "itinerary": [
    {
      "day": 1,
      "date": "2026-06-15",
      "morning": {
        "name": "Eiffel Tower",
        "description": "Visit the iconic iron lattice tower...",
        "duration": "3 hours",
        "estimated_cost": 25.0,
        "location": "Champ de Mars",
        "time_of_day": "morning"
      },
      "afternoon": {...},
      "evening": {...},
      "weather": "Sunny, 23°C",
      "travel_time": "30 minutes",
      "total_cost": 128.0,
      "notes": "Book Eiffel Tower tickets in advance"
    }
  ],
  "smart_additions": {
    "packing_list": ["Sunscreen", "Comfortable walking shoes"],
    "weather_tips": ["Sunny weather expected", "Bring light jacket"],
    "alternate_activities": ["Versailles day trip"],
    "local_tips": ["Learn basic French phrases"]
  }
}
```

Response (Error - 400):
```json
{
  "status": "error",
  "message": "Validation error",
  "detail": "End date must be after start date"
}
```

Response (Error - 500):
```json
{
  "status": "error",
  "message": "Failed to plan trip",
  "detail": "External API unavailable"
}
```

**GET /api/health**

Response:
```json
{
  "status": "healthy",
  "service": "AI Trip Planner",
  "version": "1.0.0"
}
```

#### 6.2.3 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful trip planning |
| 400 | Bad Request | Invalid input data |
| 422 | Unprocessable Entity | Pydantic validation error |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | External API failure |

### 6.3 External API Interfaces

#### 6.3.1 Nominatim API (Geocoding)

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Request:**
```
GET /search?q=Paris&format=json&limit=1
Headers:
  User-Agent: TripPlannerAI/1.0
```

**Response:**
```json
[{
  "lat": "48.8566969",
  "lon": "2.3514616",
  "display_name": "Paris, Île-de-France, France",
  "importance": 0.878
}]
```

**Rate Limit:** 1 request/second

#### 6.3.2 Open-Meteo API (Weather)

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Request:**
```
GET /forecast?latitude=48.8566&longitude=2.3522&start_date=2026-06-15&end_date=2026-06-18&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto
```

**Response:**
```json
{
  "daily": {
    "time": ["2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18"],
    "temperature_2m_max": [23.4, 24.1, 22.8, 21.5],
    "temperature_2m_min": [15.2, 16.0, 15.8, 14.9],
    "precipitation_sum": [0.0, 0.0, 2.3, 0.0],
    "weathercode": [0, 1, 3, 2]
  }
}
```

**Rate Limit:** No strict limits

#### 6.3.3 Overpass API (POI)

**Endpoint:** `https://overpass-api.de/api/interpreter`

**Request:**
```
POST /interpreter
Content-Type: application/x-www-form-urlencoded

data=[out:json];(node["tourism"](around:5000,48.8566,2.3522););out;
```

**Response:**
```json
{
  "elements": [
    {
      "type": "node",
      "id": 123456,
      "lat": 48.8584,
      "lon": 2.2945,
      "tags": {
        "name": "Eiffel Tower",
        "tourism": "attraction",
        "wikipedia": "en:Eiffel Tower"
      }
    }
  ]
}
```

**Rate Limit:** Use responsibly

#### 6.3.4 OpenRouteService API (Routing)

**Endpoint:** `https://api.openrouteservice.org/v2/directions/driving-car`

**Request:**
```
POST /v2/directions/driving-car
Headers:
  Authorization: <API_KEY>
  Content-Type: application/json

Body:
{
  "coordinates": [[2.3522, 48.8566], [2.2945, 48.8584]]
}
```

**Response:**
```json
{
  "features": [{
    "properties": {
      "summary": {
        "distance": 6234.5,
        "duration": 1234.0
      }
    }
  }]
}
```

**Fallback:** Haversine formula if API unavailable

#### 6.3.5 Groq API (LLM)

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

**Request:**
```
POST /openai/v1/chat/completions
Headers:
  Authorization: Bearer <GROQ_API_KEY>
  Content-Type: application/json

Body:
{
  "model": "llama-3.1-8b-instant",
  "messages": [
    {"role": "system", "content": "You are a trip planner..."},
    {"role": "user", "content": "Plan a trip to..."}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{...JSON itinerary...}"
    }
  }],
  "usage": {
    "prompt_tokens": 450,
    "completion_tokens": 890,
    "total_tokens": 1340
  }
}
```

---

## 7. API Design

### 7.1 RESTful API Principles

The API follows REST architectural constraints:

1. **Client-Server:** Clear separation between frontend and backend
2. **Stateless:** No server-side session management
3. **Cacheable:** Responses include cache control headers
4. **Uniform Interface:** Consistent URI structure and HTTP methods
5. **Layered System:** Can add caching/load balancing layers

### 7.2 API Versioning Strategy

**Current:** No versioning (v1 implicit)

**Future Strategy:**
- URL versioning: `/api/v1/plan-trip`, `/api/v2/plan-trip`
- Header versioning: `Accept: application/vnd.tripplanner.v1+json`
- Maintain backward compatibility for at least 2 versions

### 7.3 Request/Response Patterns

**Standard Success Response:**
```json
{
  "status": "success",
  "data": {...},
  "metadata": {
    "timestamp": "2026-02-25T10:30:00Z",
    "duration_ms": 4532
  }
}
```

**Standard Error Response:**
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "detail": "Technical details",
  "timestamp": "2026-02-25T10:30:00Z"
}
```

### 7.4 API Security

**CORS Configuration:**
```python
allow_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5500"
]
allow_methods = ["GET", "POST", "OPTIONS"]
allow_headers = ["Content-Type"]
```

**Rate Limiting:**
- 5 requests per minute per IP address
- Returns HTTP 429 (Too Many Requests) when exceeded

**Input Validation:**
- Pydantic models for automatic validation
- Type checking and constraints
- Custom validators for business logic

**API Key Management:**
- External API keys stored in environment variables
- Never logged or exposed in responses
- Validated on startup

### 7.5 API Documentation

**Tools:**
- **Swagger UI:** Available at `/docs`
- **ReDoc:** Available at `/redoc`
- Auto-generated from FastAPI/Pydantic schemas

**Documentation Includes:**
- Endpoint descriptions
- Request/response schemas
- Example requests
- Error codes
- Authentication requirements

---

## 8. Security Design

### 8.1 Security Architecture

**Security Layers:**

![Security Architecture](security-architecture-diagram.png)

*(See appendix for PlantUML code)*

### 8.2 Authentication and Authorization

**Current State:**
- No user authentication (public API)
- No authorization required
- Rate limiting by IP address

**Future Enhancements:**
- JWT-based authentication
- API key authentication for programmatic access
- Role-based access control (RBAC)
- OAuth2 integration

### 8.3 Data Security

#### 8.3.1 Input Validation

**Measures:**
- Pydantic schema validation
- Type checking
- Range validation (e.g., budget >= 100)
- String length limits
- SQL injection prevention (no database in v1)
- XSS prevention through output encoding

**Example Validators:**
```python
@validator('destination')
def validate_destination(cls, v):
    if len(v) < 2:
        raise ValueError("Destination too short")
    if not v.strip():
        raise ValueError("Destination required")
    # Sanitize HTML/script tags
    return v.strip()
```

#### 8.3.2 Output Encoding

**Measures:**
- JSON encoding for all API responses
- HTML escaping in frontend display
- No eval() or exec() of user data
- Content Security Policy headers

#### 8.3.3 Sensitive Data Handling

**API Keys:**
- Stored in `.env` file (not committed to Git)
- Loaded via environment variables
- Masked in logs: `groq_...XO1u` → `groq_...****`
- Never exposed in API responses

**User Data:**
- No persistent storage in v1
- Data retained only during request processing
- No cookies or sessions
- GDPR-compliant by design

### 8.4 Communication Security

#### 8.4.1 HTTPS/TLS

**Production Requirements:**
- All communications over HTTPS (TLS 1.2+)
- Valid SSL certificates
- Redirect HTTP to HTTPS
- HSTS headers enabled

**Development:**
- HTTP allowed for localhost only

#### 8.4.2 CORS Configuration

**Allowed Origins:**
- Explicitly listed origins only
- No wildcard (*) in production
- Configurable via environment variables

**Headers:**
```python
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

### 8.5 External API Security

**API Key Protection:**
- Keys stored in environment variables
- Never hardcoded
- Separate keys for dev/staging/prod
- Key rotation policy (quarterly)

**Request Security:**
- HTTPS only
- User-Agent headers set
- Timeout limits (30 seconds)
- Rate limit compliance

### 8.6 Error Handling and Logging

**Secure Logging:**
```python
# DO NOT LOG:
- API keys
- Full request bodies with user data
- Stack traces in production

# DO LOG:
- Request IDs
- Error types
- Timestamps
- Response times
- Anonymized metrics
```

**Error Responses:**
```python
# Production mode:
{
  "status": "error",
  "message": "Internal server error"
}

# Debug mode:
{
  "status": "error",
  "message": "Internal server error",
  "detail": "Detailed error message",
  "traceback": "..."
}
```

### 8.7 Dependency Security

**Measures:**
- Pin dependency versions in `requirements.txt`
- Regular security audits (`pip-audit`)
- Update dependencies quarterly
- Monitor CVE databases
- Automated vulnerability scanning

**Example:**
```bash
# Check for vulnerabilities
pip-audit

# Update dependencies
pip-compile --upgrade requirements.in
```

### 8.8 Rate Limiting

**Implementation:**
```python
# Pseudocode
rate_limiter = {
    "window": 60,  # seconds
    "max_requests": 5,
    "storage": "in-memory"  # or Redis
}

@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    ip = request.client.host
    if exceeds_rate_limit(ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded"}
        )
    return await call_next(request)
```

### 8.9 Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Output encoding implemented
- [ ] Rate limiting enabled
- [ ] Error messages don't expose internals
- [ ] Logging excludes sensitive data
- [ ] Dependencies regularly updated
- [ ] Security headers configured
- [ ] No hardcoded secrets in code
- [ ] .env file in .gitignore

---

## 9. Performance Considerations

### 9.1 Performance Requirements

**Target Metrics:**
- Complete trip planning: < 60 seconds (95th percentile)
- API response time: < 5 seconds (95th percentile)
- Frontend load time: < 2 seconds
- Concurrent users: 10+ without degradation
- Memory usage: < 500MB per worker
- CPU usage: < 80% under load

### 9.2 Backend Performance Optimization

#### 9.2.1 Parallel API Calls

**Strategy:** Use asyncio to call external APIs concurrently

```python
# Sequential (slow)
coords = await get_coordinates(location)
weather = await get_weather(coords)
pois = await get_points_of_interest(coords)
# Total: 3 + 2 + 4 = 9 seconds

# Parallel (fast)
results = await asyncio.gather(
    get_coordinates(location),
    get_weather(coords),
    get_points_of_interest(coords)
)
# Total: max(3, 2, 4) = 4 seconds
```

**Implementation:**
```python
async def plan_trip_fast(self, request):
    # Step 1: Geocoding (required first)
    coords = await api_service.get_coordinates(request.destination)
    
    # Step 2: Parallel calls
    weather, pois = await asyncio.gather(
        api_service.get_weather_forecast(coords...),
        api_service.get_points_of_interest(coords...)
    )
    
    # Step 3: Format and send to LLM
    itinerary = await generate_itinerary(weather, pois)
    return itinerary
```

#### 9.2.2 Caching Strategy

**Geocoding Cache:**
```python
# In-memory cache with TTL
geocoding_cache = TTLCache(maxsize=1000, ttl=86400)  # 24 hours

async def get_coordinates(location):
    if location in geocoding_cache:
        return geocoding_cache[location]
    
    result = await call_nominatim_api(location)
    geocoding_cache[location] = result
    return result
```

**Future Enhancements:**
- Redis cache for distributed systems
- Weather forecast caching (1 hour TTL)
- POI caching by location + category

#### 9.2.3 Connection Pooling

**HTTP Client Configuration:**
```python
# httpx with connection pooling
limits = httpx.Limits(
    max_keepalive_connections=20,
    max_connections=100,
    keepalive_expiry=30
)

client = httpx.AsyncClient(limits=limits, timeout=30)
```

#### 9.2.4 Database Optimization (Future)

**When adding persistent storage:**
- Connection pooling (SQLAlchemy/asyncpg)
- Query optimization with indexes
- Prepared statements
- Read replicas for scaling

### 9.3 Frontend Performance Optimization

#### 9.3.1 Asset Optimization

**HTML:**
- Minified in production
- Inline critical CSS
- Defer non-critical JavaScript

**CSS:**
- Minified and compressed
- Remove unused styles
- Use CSS variables for theming

**JavaScript:**
- Minified and compressed
- Code splitting (future: webpack)
- Lazy loading for heavy components

#### 9.3.2 Network Optimization

**Compression:**
- Gzip/Brotli compression enabled
- Compress API responses

**CDN (Future):**
- Static assets served from CDN
- Edge caching for improved latency

**Caching Headers:**
```python
# Static files
Cache-Control: public, max-age=31536000, immutable

# API responses (future)
Cache-Control: public, max-age=3600
```

#### 9.3.3 Rendering Optimization

**Progressive Rendering:**
1. Show form immediately
2. Display loading state with progress
3. Render results as they arrive

**Avoid Blocking:**
- Use async/await for API calls
- Don't block UI thread
- Debounce expensive operations

### 9.4 LLM Performance Optimization

#### 9.4.1 Prompt Engineering

**Efficient Prompts:**
- Clear, concise instructions
- Minimize token count
- Request JSON format directly
- Limit agent iterations (max 15)

#### 9.4.2 Model Selection

**Groq Models:**
- `llama-3.1-8b-instant`: Fastest (current choice)
- `llama-3.1-70b-versatile`: More capable but slower
- Trade-off between speed and quality

#### 9.4.3 Token Management

**Optimization:**
- Limit max_tokens (2000)
- Compress input data
- Avoid redundant context

### 9.5 Monitoring and Profiling

**Metrics to Track:**
```python
# Request metrics
request_duration_seconds
request_count_total
request_errors_total

# External API metrics
external_api_duration_seconds
external_api_errors_total

# Resource metrics
memory_usage_bytes
cpu_usage_percent
```

**Logging:**
```python
logger.info(f"Trip planning completed in {duration}s")
logger.info(f"External API calls: {api_call_count}")
logger.info(f"LLM tokens used: {token_count}")
```

**Tools:**
- Application Performance Monitoring (APM)
- Prometheus metrics
- Grafana dashboards
- ELK stack for log analysis

### 9.6 Load Testing

**Test Scenarios:**
```bash
# Single user
ab -n 100 -c 1 http://localhost:8000/api/health

# Concurrent users
ab -n 100 -c 10 -p request.json http://localhost:8000/api/plan-trip

# Stress test
locust -f locustfile.py --host=http://localhost:8000
```

**Load Test Script:**
```python
# locustfile.py
from locust import HttpUser, task, between

class TripPlannerUser(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def plan_trip(self):
        self.client.post("/api/plan-trip", json={
            "destination": "Paris",
            "start_date": "2026-06-15",
            "end_date": "2026-06-18",
            "budget": 1500,
            "travelers": 2,
            "interests": ["culture", "food"],
            "pace": "balanced"
        })
```

### 9.7 Performance Optimization Summary

| Area | Optimization | Impact |
|------|--------------|--------|
| API Calls | Parallel execution | 50-60% faster |
| Caching | Geocoding cache | 80% faster on cache hit |
| HTTP | Connection pooling | 20-30% faster |
| Frontend | Asset minification | 30-40% faster load |
| LLM | Prompt optimization | 20-30% fewer tokens |
| Total | Combined optimizations | 3-5x faster overall |

---

## 10. Deployment Architecture

### 10.1 Deployment Environment

**Supported Platforms:**
- **Local Development:** localhost, virtual environments
- **Cloud Platforms:** AWS, Azure, Google Cloud Platform
- **PaaS:** Heroku, Railway, Render, Fly.io
- **Containers:** Docker, Kubernetes
- **Servers:** Linux, Windows Server, macOS

### 10.2 Docker Deployment

**Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .
COPY frontend/ ../frontend/

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  tripplanner:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - OPENROUTE_API_KEY=${OPENROUTE_API_KEY}
      - DEBUG=False
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 10.3 Cloud Deployment

#### 10.3.1 AWS Deployment

**Architecture:**
```
Internet
  ↓
[CloudFront CDN] → [S3 Bucket (Frontend)]
  ↓
[Application Load Balancer]
  ↓
[ECS/Fargate Container] ← [ECR (Docker Image)]
  ↓
[CloudWatch Logs]
```

**Services Used:**
- **ECS/Fargate:** Run Docker containers
- **ECR:** Docker image registry
- **ALB:** Load balancing
- **CloudFront:** CDN for frontend
- **S3:** Frontend static files
- **CloudWatch:** Logs and metrics
- **Secrets Manager:** API keys

#### 10.3.2 Azure Deployment

**Architecture:**
```
Internet
  ↓
[Azure Front Door]
  ↓
[App Service (Container)]
  ↓
[Azure Monitor]
```

**Services Used:**
- **App Service:** Container hosting
- **Container Registry:** Docker images
- **Front Door:** CDN and WAF
- **Key Vault:** API keys
- **Application Insights:** Monitoring

#### 10.3.3 GCP Deployment

**Architecture:**
```
Internet
  ↓
[Cloud CDN]
  ↓
[Cloud Load Balancing]
  ↓
[Cloud Run] ← [Container Registry]
  ↓
[Cloud Logging]
```

**Services Used:**
- **Cloud Run:** Serverless containers
- **Container Registry:** Docker images
- **Cloud CDN:** Content delivery
- **Secret Manager:** API keys
- **Cloud Logging:** Logs and traces

### 10.4 Environment Configuration

**Environment Variables:**
```bash
# Required
GROQ_API_KEY=gsk_your_api_key_here

# Optional
OPENROUTE_API_KEY=your_openroute_key
HOST=0.0.0.0
PORT=8000
DEBUG=False

# CORS (production)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**.env.example:**
```bash
# Groq API Key (required)
GROQ_API_KEY=your_groq_api_key_here

# OpenRouteService API Key (optional, has fallback)
OPENROUTE_API_KEY=your_api_key

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### 10.5 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r backend/requirements.txt
      - name: Run tests
        run: pytest backend/tests/
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t tripplanner:latest .
      - name: Push to registry
        run: docker push tripplanner:latest
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands here
          kubectl apply -f k8s/deployment.yaml
```

### 10.6 Scaling Strategy

#### 10.6.1 Horizontal Scaling

**Approach:** Add more application instances

**Benefits:**
- Stateless design enables easy scaling
- Load balancer distributes traffic
- No session management required

**Implementation:**
```yaml
# Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tripplanner
spec:
  replicas: 3  # Scale to 3 instances
  selector:
    matchLabels:
      app: tripplanner
  template:
    spec:
      containers:
      - name: tripplanner
        image: tripplanner:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

**Auto-scaling:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: tripplanner-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tripplanner
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### 10.6.2 Vertical Scaling

**Approach:** Increase resources per instance

**When to Use:**
- Memory-intensive operations
- CPU-bound processing
- Limited horizontal scaling

**Implementation:**
- Increase container memory
- Add more CPU cores
- Optimize code before scaling

### 10.7 High Availability

**Requirements:**
- **Uptime:** 99% target
- **Redundancy:** Multiple instances across availability zones
- **Health Checks:** Regular endpoint monitoring
- **Failover:** Automatic instance replacement

**Load Balancer Configuration:**
```yaml
# Health check settings
health_check:
  path: /api/health
  interval: 30s
  timeout: 5s
  healthy_threshold: 2
  unhealthy_threshold: 3
```

### 10.8 Backup and Disaster Recovery

**Current State (Stateless):**
- No persistent data to back up
- Configuration in version control
- Docker images in registry

**Future (With Database):**
- Daily automated backups
- Point-in-time recovery
- Multi-region replication
- 30-day retention policy

---

## 11. Error Handling Strategy

### 11.1 Error Categories

#### 11.1.1 Client Errors (4xx)

**400 Bad Request:**
- Invalid input data
- Missing required fields
- Validation failures

**Example:**
```json
{
  "status": "error",
  "message": "Validation error",
  "detail": "Start date must be after today",
  "code": "INVALID_DATE"
}
```

**422 Unprocessable Entity:**
- Pydantic validation errors
- Type mismatches
- Constraint violations

**429 Too Many Requests:**
- Rate limit exceeded

#### 11.1.2 Server Errors (5xx)

**500 Internal Server Error:**
- Unhandled exceptions
- Application crashes
- LLM parsing errors

**503 Service Unavailable:**
- External API failures
- Timeout errors
- Temporary outages

### 11.2 Error Handling Layers

#### 11.2.1 Frontend Error Handling

```javascript
try {
    const response = await apiClient.planTrip(formData);
    displayResults(response);
} catch (error) {
    if (error.status === 400) {
        showError("Please check your input: " + error.message);
    } else if (error.status === 500) {
        showError("Server error. Please try again later.");
    } else if (error.status === 503) {
        showError("Service temporarily unavailable. Please retry.");
    } else {
        showError("An unexpected error occurred.");
    }
    console.error("Error:", error);
}
```

#### 11.2.2 Backend Error Handling

**Route Level:**
```python
@router.post("/api/plan-trip")
async def plan_trip(request: TripRequest):
    try:
        # Validate API key
        if not settings.groq_api_key:
            raise HTTPException(
                status_code=500,
                detail="Groq API key not configured"
            )
        
        # Call service
        result = await trip_service.plan_trip(request)
        return result
    
    except ValueError as e:
        # Validation errors
        raise HTTPException(status_code=400, detail=str(e))
    
    except ExternalAPIError as e:
        # External service failures
        raise HTTPException(status_code=503, detail=str(e))
    
    except Exception as e:
        # Unexpected errors
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
```

**Service Level:**
```python
async def plan_trip(self, request: TripRequest) -> TripResponse:
    try:
        # Geocoding with fallback
        coords = await api_service.get_coordinates(request.destination)
        if not coords:
            raise ValueError(f"Location not found: {request.destination}")
        
        # Weather with default
        weather = await api_service.get_weather_forecast(coords...)
        if not weather:
            weather = self._default_weather()
        
        # POI with retry
        pois = await self._get_pois_with_retry(coords...)
        
        # Generate itinerary
        return await self._generate_itinerary(...)
    
    except Exception as e:
        logger.error(f"Trip planning failed: {e}")
        raise
```

**External API Level:**
```python
async def get_coordinates(self, location: str) -> Optional[Dict]:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data:
                return self._parse_coordinates(data[0])
            return None
    
    except httpx.TimeoutException:
        logger.error(f"Timeout getting coordinates for {location}")
        return None
    
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error {e.response.status_code}")
        return None
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return None
```

### 11.3 Fallback Mechanisms

#### 11.3.1 External API Fallbacks

**Geocoding:**
- Primary: Nominatim API
- Fallback: Return error to user (cannot proceed without coordinates)

**Weather:**
- Primary: Open-Meteo API
- Fallback: Generic weather advice ("Check weather forecast before traveling")

**POI:**
- Primary: Overpass API
- Fallback: Generic attractions based on destination type

**Routing:**
- Primary: OpenRouteService API
- Fallback: Haversine distance formula

#### 11.3.2 LLM Fallbacks

**Groq API Failure:**
- Retry 3 times with exponential backoff
- If still fails: Use template-based itinerary generation
- Return structured response without AI enhancement

### 11.4 Retry Logic

**Exponential Backoff:**
```python
async def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            logger.warning(f"Retry {attempt + 1}/{max_retries} after {wait_time}s")
            await asyncio.sleep(wait_time)
```

**Usage:**
```python
coords = await retry_with_backoff(
    lambda: api_service.get_coordinates(location)
)
```

### 11.5 Logging Strategy

**Log Levels:**
```python
# DEBUG: Detailed diagnostic info
logger.debug(f"Request parameters: {params}")

# INFO: General informational messages
logger.info(f"Trip planning started for {destination}")

# WARNING: Warning messages (recoverable issues)
logger.warning(f"Weather API unavailable, using defaults")

# ERROR: Error messages (handled exceptions)
logger.error(f"Failed to get coordinates: {e}")

# CRITICAL: Critical errors (system failures)
logger.critical(f"Database connection lost")
```

**Structured Logging:**
```python
logger.info(
    "trip_planning_completed",
    extra={
        "destination": request.destination,
        "duration_seconds": duration,
        "api_calls": api_call_count,
        "success": True
    }
)
```

### 11.6 Monitoring and Alerts

**Metrics to Monitor:**
- Error rate (errors/total requests)
- External API failure rate
- Response time percentiles
- Memory/CPU usage

**Alerting Rules:**
```yaml
# Error rate alert
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  annotations:
    summary: "Error rate above 5%"

# External API alert
- alert: ExternalAPIDown
  expr: external_api_success_rate < 0.9
  annotations:
    summary: "External API success rate below 90%"
```

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
        /\
       /  \    E2E Tests (5%)
      /____\   
     /      \  Integration Tests (15%)
    /________\ 
   /          \
  /____________\ Unit Tests (80%)
```

### 12.2 Unit Testing

**Framework:** pytest

**Coverage Target:** 70%+

**Example Tests:**
```python
# tests/test_models.py
def test_trip_request_validation():
    # Valid request
    request = TripRequest(
        destination="Paris",
        start_date="2026-06-15",
        end_date="2026-06-18",
        budget=1500,
        travelers=2,
        interests=["culture"],
        pace="balanced"
    )
    assert request.destination == "Paris"
    
    # Invalid date
    with pytest.raises(ValidationError):
        TripRequest(
            destination="Paris",
            start_date="2026-06-18",
            end_date="2026-06-15",  # Before start_date
            budget=1500,
            travelers=2,
            interests=["culture"],
            pace="balanced"
        )

# tests/test_services.py
@pytest.mark.asyncio
async def test_get_coordinates():
    service = APIService()
    result = await service.get_coordinates("Paris, France")
    
    assert result is not None
    assert "lat" in result
    assert "lon" in result
    assert abs(result["lat"] - 48.8566) < 0.1
    assert abs(result["lon"] - 2.3522) < 0.1

# tests/test_helpers.py
def test_calculate_duration():
    from datetime import date
    start = date(2026, 6, 15)
    end = date(2026, 6, 18)
    duration = calculate_duration(start, end)
    assert duration == 4
```

### 12.3 Integration Testing

**Test External APIs:**
```python
@pytest.mark.integration
@pytest.mark.asyncio
async def test_trip_planning_integration():
    request = TripRequest(
        destination="Paris, France",
        start_date="2026-06-15",
        end_date="2026-06-18",
        budget=1500,
        travelers=2,
        interests=["culture", "food"],
        pace="balanced"
    )
    
    service = TripService()
    response = await service.plan_trip(request)
    
    assert response.overview.destination == "Paris"
    assert len(response.itinerary) == 4
    assert response.smart_additions.packing_list
```

### 12.4 API Testing

**Framework:** pytest + httpx

**Example:**
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_plan_trip_endpoint():
    request_data = {
        "destination": "Paris, France",
        "start_date": "2026-06-15",
        "end_date": "2026-06-18",
        "budget": 1500,
        "travelers": 2,
        "interests": ["culture", "food"],
        "pace": "balanced"
    }
    
    response = client.post("/api/plan-trip", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "overview" in data
    assert "itinerary" in data
    assert "smart_additions" in data
```

### 12.5 End-to-End Testing

**Framework:** Playwright or Selenium

**Example Scenarios:**
```python
def test_complete_trip_planning_flow(page):
    # Navigate to app
    page.goto("http://localhost:8000")
    
    # Fill form
    page.fill("#destination", "Paris, France")
    page.fill("#startDate", "2026-06-15")
    page.fill("#endDate", "2026-06-18")
    page.fill("#budget", "1500")
    page.fill("#travelers", "2")
    page.check("input[value='culture']")
    page.check("input[value='food']")
    page.check("input[value='balanced']")
    
    # Submit form
    page.click("#planButton")
    
    # Wait for results
    page.wait_for_selector("#resultsSection", state="visible")
    
    # Verify results displayed
    assert page.is_visible("#tripOverview")
    assert page.is_visible("#itineraryContainer")
    
    # Verify data
    destination = page.text_content("#destinationTitle")
    assert "Paris" in destination
```

### 12.6 Performance Testing

**Tools:** Locust, Apache Bench, k6

**Load Test:**
```python
# locustfile.py
from locust import HttpUser, task, between

class TripPlannerUser(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def plan_trip(self):
        self.client.post("/api/plan-trip", json={
            "destination": "Paris, France",
            "start_date": "2026-06-15",
            "end_date": "2026-06-18",
            "budget": 1500,
            "travelers": 2,
            "interests": ["culture", "food"],
            "pace": "balanced"
        })
    
    @task(2)
    def health_check(self):
        self.client.get("/api/health")

# Run: locust -f locustfile.py --host=http://localhost:8000
```

**Performance Criteria:**
- 95th percentile response time < 60s
- Support 10 concurrent users
- Error rate < 1%
- Memory usage < 500MB per worker

### 12.7 Security Testing

**Tools:** OWASP ZAP, Bandit, pip-audit

**Tests:**
```bash
# Dependency vulnerabilities
pip-audit

# Code security issues
bandit -r backend/

# API security scan
zap-cli quick-scan http://localhost:8000
```

**Manual Tests:**
- SQL injection attempts
- XSS payload injection
- CORS bypass attempts
- Rate limit testing
- API key exposure checks

### 12.8 Test Data

**Mock Data:**
```python
# tests/fixtures.py
@pytest.fixture
def sample_trip_request():
    return {
        "destination": "Paris, France",
        "start_date": "2026-06-15",
        "end_date": "2026-06-18",
        "budget": 1500,
        "travelers": 2,
        "interests": ["culture", "food"],
        "pace": "balanced"
    }

@pytest.fixture
def mock_coordinates():
    return {
        "lat": 48.8566,
        "lon": 2.3522,
        "display_name": "Paris, Île-de-France, France"
    }

@pytest.fixture
def mock_weather():
    return {
        "daily": {
            "time": ["2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18"],
            "temperature_2m_max": [23.4, 24.1, 22.8, 21.5],
            "temperature_2m_min": [15.2, 16.0, 15.8, 14.9],
            "precipitation_sum": [0.0, 0.0, 2.3, 0.0],
            "weathercode": [0, 1, 3, 2]
        }
    }
```

### 12.9 Continuous Testing

**CI/CD Integration:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          pip install pytest pytest-asyncio pytest-cov
      
      - name: Run unit tests
        run: pytest backend/tests/ --cov=backend --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

---

## 13. Appendices

### 13.1 PlantUML Diagram Codes

All PlantUML diagram codes are provided in separate files for easy copying and rendering.

**Available Diagram Files:**
1. `diagrams/system-context-diagram.puml`
2. `diagrams/high-level-architecture-diagram.puml`
3. `diagrams/component-architecture-diagram.puml`
4. `diagrams/data-flow-diagram.puml`
5. `diagrams/deployment-architecture-diagram.puml`
6. `diagrams/security-architecture-diagram.puml`
7. `diagrams/sequence-diagram.puml` (already exists)
8. `diagrams/data-models-diagram.puml` (already exists)
9. `diagrams/ui-wireframe.puml`
10. `diagrams/er-diagram-future.puml`

### 13.2 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | User interface |
| **Backend Framework** | FastAPI 0.100+ | REST API server |
| **AI Framework** | LangChain 0.1+ | Agent orchestration |
| **LLM Provider** | Groq API | AI inference |
| **LLM Model** | Llama 3.1 8B Instant | Fast language model |
| **Validation** | Pydantic 2.0+ | Data validation |
| **HTTP Client** | httpx | Async HTTP requests |
| **ASGI Server** | Uvicorn | Production server |
| **Geocoding** | OSM Nominatim | Location coordinates |
| **Weather** | Open-Meteo | Weather forecasts |
| **POI** | Overpass API | Points of interest |
| **Routing** | OpenRouteService | Route calculation |
| **Containerization** | Docker | Deployment |
| **Testing** | pytest | Unit/integration tests |

### 13.3 API Endpoint Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/` | GET | API information | None |
| `/api/plan-trip` | POST | Generate itinerary | None |
| `/api/health` | GET | Health check | None |
| `/api/sample-request` | GET | Example request | None |
| `/docs` | GET | Swagger UI | None |
| `/redoc` | GET | ReDoc UI | None |

### 13.4 Configuration Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | Yes | - | Groq API authentication |
| `OPENROUTE_API_KEY` | No | - | OpenRouteService (optional) |
| `HOST` | No | 0.0.0.0 | Server bind address |
| `PORT` | No | 8000 | Server port |
| `DEBUG` | No | True | Debug mode |
| `CORS_ORIGINS` | No | localhost | Allowed origins |

### 13.5 Error Code Reference

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INVALID_DATE` | 400 | Invalid date format or logic | Check date inputs |
| `INVALID_BUDGET` | 400 | Budget too low or invalid | Increase budget |
| `LOCATION_NOT_FOUND` | 400 | Destination not found | Check spelling |
| `VALIDATION_ERROR` | 422 | Pydantic validation failed | Fix input data |
| `API_KEY_MISSING` | 500 | Groq API key not set | Contact admin |
| `EXTERNAL_API_ERROR` | 503 | External service unavailable | Retry later |
| `LLM_ERROR` | 500 | LLM failed to generate | Retry request |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait and retry |

### 13.6 External API Rate Limits

| API | Rate Limit | Notes |
|-----|------------|-------|
| Nominatim | 1 req/sec | Use User-Agent header |
| Open-Meteo | No limit | Free tier generous |
| Overpass | No strict limit | Use responsibly |
| OpenRouteService | Varies by tier | Free tier: 40 req/min |
| Groq | Varies by tier | Free tier available |

### 13.7 Glossary

See Section 1.3 for acronyms and definitions.

### 13.8 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-25 | Initial design document | Development Team |

---

**Document Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Lead Architect | | | |
| Backend Lead | | | |
| Frontend Lead | | | |
| DevOps Lead | | | |
| QA Lead | | | |

---

**End of Design Document**

*This document is subject to change. All updates should be reviewed and approved by the technical leads.*
