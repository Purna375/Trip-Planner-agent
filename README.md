# 🌍 AI Trip Planner

A production-ready, intelligent trip planning system powered by AI agents. This application uses **LangChain's ReAct pattern** to orchestrate multiple tools and create personalized, optimized travel itineraries.

## 🎯 Features

- **🤖 Agentic AI Architecture**: Uses LangChain agent with reasoning capabilities
- **⚡ Powered by Groq**: Ultra-fast inference with Llama 3.1 70B
- **🌐 Real-time External APIs**: Integrates OpenStreetMap, Open-Meteo, and more
- **📅 Day-by-Day Itineraries**: Structured activities for morning, afternoon, and evening
- **🌤️ Weather-Aware Planning**: Adjusts recommendations based on forecasts
- **💰 Budget Management**: Estimates costs and tracks daily spending
- **📦 Smart Recommendations**: Packing lists, weather tips, and local insights
- **🎨 Modern UI**: Clean, responsive interface built with vanilla JavaScript
- **🔧 Modular Architecture**: Well-structured backend with separation of concerns

## 🏗️ Architecture

### Backend Structure

```
backend/
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
├── agents/
│   ├── trip_agent.py         # LangChain agent with ReAct pattern
│   └── tools.py              # Agent tools (coordinates, weather, POI, routing)
├── models/
│   └── schemas.py            # Pydantic models for validation
├── routes/
│   └── trip_planner.py       # API endpoints
├── services/
│   ├── api_service.py        # External API integrations
│   └── trip_service.py       # Business logic orchestration
└── utils/
    ├── config.py             # Configuration management
    └── helpers.py            # Helper functions
```

### Frontend Structure

```
frontend/
├── index.html                # Main HTML page
├── css/
│   └── styles.css           # Responsive styling
└── js/
    ├── api.js               # API client
    └── app.js               # Application logic
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, high-performance web framework
- **LangChain**: AI agent orchestration with ReAct pattern
- **Groq**: Ultra-fast LLM inference (Llama 3.1 70B)
- **Pydantic**: Data validation and settings management
- **HTTPX**: Async HTTP client for external APIs

### Frontend
- **HTML5/CSS3**: Semantic markup and modern styling
- **Vanilla JavaScript**: No framework dependencies
- **Flexbox/Grid**: Responsive layout
- **Fetch API**: Async HTTP requests

### External APIs (All Free!)
- **OpenStreetMap (Nominatim)**: Geocoding and location data
- **Open-Meteo**: Weather forecasts
- **Overpass API**: Points of interest (tourist attractions)
- **OpenRouteService**: Route calculations (optional, has fallback)

## 🚀 Setup Instructions

### Prerequisites

- Python 3.9+
- Groq API Key ([Get free key here](https://console.groq.com) - Free tier available!)
- (Optional) OpenRouteService API Key ([Free tier](https://openrouteservice.org/))

### Step 1: Clone and Navigate

```bash
cd "c:\Users\gidut\OneDrive\Desktop\trip agent"
```

### Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env

# Edit .env and add your Groq API key
# Required: GROQ_API_KEY=your_key_here
# Optional: OPENROUTE_API_KEY=your_key_here
```

### Step 3: Start Backend Server

```bash
python main.py
```

The backend will start on `http://localhost:8000`

- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### Step 4: Open Frontend

Open `frontend/index.html` in your browser, OR use a local server:

```bash
# Using Python's built-in server
cd frontend
python -m http.server 5500
```

Then visit `http://localhost:5500`

## 📖 API Documentation

### Endpoints

#### POST `/api/plan-trip`

Plan a complete trip with AI.

**Request Body:**

```json
{
  "destination": "Paris, France",
  "start_date": "2024-06-15",
  "end_date": "2024-06-18",
  "budget": 1500.0,
  "travelers": 2,
  "interests": ["culture", "food", "museums", "architecture"],
  "pace": "balanced"
}
```

**Response:**

```json
{
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
    "coordinates": {
      "lat": 48.8566,
      "lon": 2.3522
    }
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
    "agent_used": "langchain_react",
    "tools_available": ["coordinates", "weather", "poi", "route"]
  }
}
```

#### GET `/api/health`

Health check endpoint.

#### GET `/api/sample-request`

Get a sample request JSON for testing.

#### GET `/api/sample-response`

Get a sample response structure.

## 🧠 Agent Flow Explanation

The application uses LangChain's **ReAct (Reasoning + Acting)** pattern:

### Agent Workflow:

1. **Receive User Input**: Destination, dates, budget, interests, pace
2. **Reasoning Phase**: Agent decides which tools to use
3. **Tool Execution**:
   - `get_coordinates`: Geocode destination → lat/lon
   - `get_weather`: Fetch forecast for dates → weather data
   - `get_points_of_interest`: Find attractions → POIs list
   - `calculate_route`: Estimate travel times → distances
4. **Synthesis Phase**: Agent reasons about collected data
5. **Generation Phase**: Create structured itinerary
6. **Post-Processing**: Format response, add smart recommendations

### Agent Tools:

```python
tools = [
    get_coordinates,      # OpenStreetMap Nominatim
    get_weather,          # Open-Meteo API
    get_points_of_interest,  # Overpass API
    calculate_route       # OpenRouteService / Haversine
]
```

### Why ReAct Pattern?

- **Reasoning**: Agent thinks before acting
- **Observing**: Reviews tool outputs
- **Adapting**: Changes strategy based on results
- **Structured**: Clear thought → action → observation loop

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Form Validation**: Client-side validation before submission
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Download Feature**: Export itinerary as JSON
- **Animated UI**: Smooth transitions and loading animations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (has fallback to Haversine formula)
OPENROUTE_API_KEY=your_openroute_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Travel Pace Options

- **Relaxed**: 2 activities per day, more free time
- **Balanced**: 3 activities per day (recommended)
- **Packed**: 4+ activities per day, intensive itinerary

### Available Interests

`culture`, `history`, `food`, `nature`, `adventure`, `museums`, `art`, `shopping`, `nightlife`, `beaches`, `architecture`, `photography`, `hiking`, `local_life`

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:8000/api/health

# Get sample request
curl http://localhost:8000/api/sample-request

# Plan a trip (using sample data)
curl -X POST http://localhost:8000/api/plan-trip \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

### Test Frontend

1. Open browser console
2. Fill out the form
3. Submit and check Network tab for API calls
4. Verify response rendering

## 📊 Performance Considerations

- **Agent Reasoning**: Typically 10-30 seconds depending on complexity
- **API Calls**: Batched where possible
- **Rate Limiting**: Respects API rate limits with user-agent headers
- **Caching**: Can be added for frequently requested destinations

## 🐛 Troubleshooting

### Common Issues

**1. "Groq API key not configured"**
- Solution: Add `GROQ_API_KEY` to `.env` file
- Get free key at: https://console.groq.com

**2. "Location not found"**
- Solution: Use full location names (e.g., "Paris, France" not "Paris")

**3. CORS errors**
- Solution: Ensure backend allows your frontend origin
- Check `CORS_ORIGINS` in settings

**4. Agent takes too long**
- Normal: Complex reasoning takes 15-45 seconds
- Check: Network connectivity to external APIs

**5. Weather data unavailable**
- Fallback: System provides default weather assumptions
- Check: Open-Meteo API status

## 🚧 Future Enhancements

- [ ] RAG implementation with travel knowledge base
- [ ] Multi-destination trips
- [ ] Flight and accommodation suggestions
- [ ] Real-time traffic data integration
- [ ] User accounts and saved trips
- [ ] Mobile app version
- [ ] More language support
- [ ] Calendar integration

## 📄 License

This is a demonstration project for educational purposes.

## 👨‍💻 Author

Built with ❤️ using modern AI and web technologies.

---

## 🎓 Architecture Decisions

### Why FastAPI?
- Modern async support
- Automatic API documentation
- Type validation with Pydantic
- High performance

### Why LangChain?
- Agent orchestration out-of-the-box
- Tool abstractions
- ReAct pattern implementation
- Easy LLM integration

### Why Groq?
- **Ultra-fast inference** (10x faster than typical APIs)
- **Free tier available** with generous limits
- **Powerful models** (Llama 3.1 70B)
- **Production-ready** infrastructure

### Why Vanilla JavaScript?
- No build step required
- Lightweight and fast
- Easy to understand and modify
- No framework lock-in

### Why These APIs?
- **Free tier available**
- **No authentication for most** (OpenStreetMap, Open-Meteo)
- **Reliable and well-documented**
- **Production-ready**

---

**Made with AI • Open Source APIs • Modern Architecture** 🚀
