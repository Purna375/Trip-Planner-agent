# AI Trip Planner - Agent Architecture Documentation

## Overview

This document explains the agentic AI architecture used in the Trip Planner application. The system uses **LangChain's ReAct (Reasoning + Acting) pattern** to create an autonomous agent that can reason, use tools, and generate intelligent travel itineraries.

## Agent Architecture

### What is an AI Agent?

An AI agent is an AI system that can:
1. **Perceive** its environment (receive inputs)
2. **Reason** about what actions to take
3. **Act** using available tools
4. **Observe** the results of its actions
5. **Adapt** its strategy based on observations

### ReAct Pattern

**ReAct = Reasoning + Acting**

The agent alternates between:
- **Thought**: Reasoning about what to do next
- **Action**: Calling a tool to gather information
- **Observation**: Receiving the tool's output
- Repeat until the task is complete

## System Components

### 1. Agent Core (`agents/trip_agent.py`)

The central intelligence that orchestrates the entire planning process.

**Key Features:**
- Uses Llama 3.1 70B via Groq (ultra-fast inference)
- Implements ReAct pattern through LangChain
- Manages conversation context
- Decides which tools to use and when
- Synthesizes information into structured output

**Agent Prompt:**
```
You are an expert AI travel planner.
Your job is to create detailed, personalized travel itineraries.

You have access to these tools: [list of tools]

Use the following format:
Question: [user's request]
Thought: [reasoning about what to do]
Action: [tool to use]
Action Input: [input for the tool]
Observation: [tool output]
... (repeat as needed)
Final Answer: [structured JSON itinerary]
```

### 2. Agent Tools (`agents/tools.py`)

Tools are functions the agent can call to gather information.

#### Tool 1: get_coordinates
**Purpose**: Convert location name to latitude/longitude
**API**: OpenStreetMap Nominatim
**Input**: Location string (e.g., "Paris, France")
**Output**: `{"lat": 48.8566, "lon": 2.3522, "display_name": "Paris, Île-de-France, France"}`

**Example Agent Usage:**
```
Thought: I need to find the coordinates for Paris
Action: get_coordinates
Action Input: "Paris, France"
Observation: {"lat": 48.8566, "lon": 2.3522}
```

#### Tool 2: get_weather
**Purpose**: Get weather forecast for specific dates
**API**: Open-Meteo
**Input**: Coordinates + date range
**Output**: Temperature, precipitation, weather codes

**Example Agent Usage:**
```
Thought: I need weather data to plan outdoor activities
Action: get_weather
Action Input: {"lat": 48.8566, "lon": 2.3522, "start_date": "2024-06-15", "end_date": "2024-06-18"}
Observation: {"temp_max": [23, 24, 22, 21], "precipitation": [0, 0, 2, 0]}
```

#### Tool 3: get_points_of_interest
**Purpose**: Find tourist attractions and activities
**API**: Overpass API (OpenStreetMap)
**Input**: Coordinates + interests
**Output**: List of POIs with names, types, locations

**Example Agent Usage:**
```
Thought: I need to find museums and cultural sites
Action: get_points_of_interest
Action Input: {"lat": 48.8566, "lon": 2.3522, "interests": "culture,museums,art"}
Observation: [{"name": "Louvre Museum", "type": "museum", "lat": 48.8606, "lon": 2.3376}, ...]
```

#### Tool 4: calculate_route
**Purpose**: Estimate travel time between locations
**API**: OpenRouteService or Haversine formula
**Input**: Start and end coordinates
**Output**: Distance and duration

**Example Agent Usage:**
```
Thought: I need to know how long it takes to travel between activities
Action: calculate_route
Action Input: {"start_lat": 48.8566, "start_lon": 2.3522, "end_lat": 48.8606, "end_lon": 2.3376}
Observation: {"distance_km": 1.2, "duration_minutes": 15}
```

### 3. Service Layer (`services/`)

#### API Service (`api_service.py`)
- Handles all external API calls
- Implements rate limiting and error handling
- Provides fallbacks when APIs are unavailable
- Caches responses to reduce API calls

#### Trip Service (`trip_service.py`)
- Orchestrates the agent
- Formats agent output into structured response
- Adds smart recommendations
- Calculates budgets and generates packing lists

## Agent Execution Flow

### Step-by-Step Process

```
User Request
    ↓
1. INITIALIZE
   - Validate inputs
   - Calculate trip metrics
   - Prepare agent context
    ↓
2. AGENT REASONING LOOP
   ─────────────────────────
   │ Thought: What should I do first?
   │ → Get coordinates for the destination
   │
   │ Action: get_coordinates("Paris, France")
   │ Observation: Got coordinates
   │
   │ Thought: Now I need weather data
   │ → Get weather forecast
   │
   │ Action: get_weather(coords, dates)
   │ Observation: Got weather data
   │
   │ Thought: Find attractions matching interests
   │ → Get points of interest
   │
   │ Action: get_points_of_interest(coords, interests)
   │ Observation: Got 25 POIs
   │
   │ Thought: I have all information needed
   │ → Create structured itinerary
   │
   │ Final Answer: [JSON itinerary]
   ─────────────────────────
    ↓
3. POST-PROCESSING
   - Parse agent output
   - Add smart additions
   - Format for frontend
    ↓
Response to User
```

### Example Agent Conversation

```
Question: Create a trip to Paris from June 15-18, 2024, budget $1500, 2 travelers, interested in culture and food, balanced pace

Thought: I need to start by getting the coordinates for Paris, France
Action: get_coordinates
Action Input: "Paris, France"
Observation: {"lat": 48.8566, "lon": 2.3522, "display_name": "Paris, Île-de-France, France"}

Thought: Now I need to get the weather forecast for the travel dates
Action: get_weather
Action Input: {"lat": 48.8566, "lon": 2.3522, "start_date": "2024-06-15", "end_date": "2024-06-18"}
Observation: {"dates": ["2024-06-15", "2024-06-16", "2024-06-17", "2024-06-18"], "temp_max": [23, 24, 22, 21], "temp_min": [15, 16, 15, 14]}

Thought: I need to find points of interest that match culture and food interests
Action: get_points_of_interest
Action Input: {"lat": 48.8566, "lon": 2.3522, "interests": "culture,food,museums"}
Observation: [{"name": "Louvre Museum", "type": "museum"}, {"name": "Eiffel Tower", "type": "attraction"}, ...]

Thought: I now have all the information needed to create a comprehensive itinerary
Final Answer: {
  "destination_info": {...},
  "daily_itineraries": [
    {
      "day": 1,
      "activities": [...]
    }
  ],
  "recommendations": {...}
}
```

## Intelligence Features

### 1. Context-Aware Planning

The agent considers multiple factors:
- **Weather**: Suggests indoor activities on rainy days
- **Budget**: Balances expensive and free activities
- **Interests**: Prioritizes matching attractions
- **Pace**: Adjusts number of activities per day
- **Travel Time**: Minimizes transit between locations

### 2. Adaptive Reasoning

The agent can:
- **Recover from errors**: If a tool fails, try alternative approach
- **Validate data**: Check if coordinates are reasonable
- **Make trade-offs**: Balance cost vs. experience
- **Optimize routes**: Group nearby activities together

### 3. Smart Recommendations

Post-processing adds:
- **Packing lists**: Based on weather
- **Weather tips**: Activity adjustments
- **Alternate activities**: Backup plans
- **Local tips**: Cultural insights

## Configuration

### LLM Settings

```python
llm = ChatGroq(
    model="llama-3.1-70b-versatile",  # Fast and powerful Llama model
    temperature=0.7,                    # Balance creativity and consistency
    groq_api_key=settings.groq_api_key # Ultra-fast inference
)
```

### Agent Settings

```python
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,                     # Log reasoning steps
    max_iterations=10,                # Prevent infinite loops
    handle_parsing_errors=True        # Graceful error handling
)
```

## Error Handling

### Tool Failures

If a tool fails:
1. Agent receives error observation
2. Can try alternative tool
3. Can use fallback data
4. Can adjust strategy

Example:
```
Action: get_weather
Observation: Error - Weather API unavailable

Thought: Weather data unavailable, I'll use general seasonal assumptions
→ Continues with general weather patterns for June in Paris
```

### Parsing Errors

If agent output is malformed:
1. Attempt to extract JSON
2. Use default structure
3. Log error for debugging
4. Return partial results

## Performance Optimization

### Caching
- Cache geocoding results
- Cache weather forecasts (valid for hours)
- Cache popular POIs

### Parallel Execution
- Tools are called sequentially (agent decides order)
- But multiple POI queries could be parallelized
- Future: Run agent reasoning in background task

### Token Optimization
- Compact tool descriptions
- Summarize long observations
- Limit POI results to top matches

## Testing the Agent

### 1. Verbose Mode

Enable verbose logging to see reasoning:

```python
agent_executor = AgentExecutor(
    verbose=True,  # Prints all thoughts and actions
    ...
)
```

Output:
```
> Entering new AgentExecutor chain...
Thought: I need coordinates first
Action: get_coordinates
Action Input: "Paris, France"
Observation: {"lat": 48.8566, "lon": 2.3522}
...
```

### 2. Test Individual Tools

```python
from agents.tools import get_coordinates_tool

result = get_coordinates_tool("Paris, France")
print(result)
```

### 3. Unit Tests

```python
def test_agent_reasoning():
    agent = get_trip_agent()
    request = {
        "destination": "Paris, France",
        "start_date": "2024-06-15",
        "end_date": "2024-06-18",
        ...
    }
    result = agent.plan_trip(request)
    assert "daily_itineraries" in result
```

## Extending the Agent

### Adding New Tools

1. Create tool function:
```python
def get_restaurants_tool(lat: float, lon: float) -> str:
    # Call restaurant API
    return json.dumps(results)
```

2. Define LangChain tool:
```python
restaurant_tool = Tool(
    name="get_restaurants",
    func=get_restaurants_tool,
    description="Get restaurant recommendations near coordinates"
)
```

3. Add to tool list:
```python
trip_planning_tools.append(restaurant_tool)
```

4. Agent automatically learns to use it!

### Adding RAG (Retrieval-Augmented Generation)

To add a knowledge base:

1. Create vector store:
```python
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

vectorstore = FAISS.from_documents(
    documents=travel_guides,
    embedding=OpenAIEmbeddings()
)
```

2. Create retrieval tool:
```python
retrieval_tool = Tool(
    name="search_travel_knowledge",
    func=vectorstore.similarity_search,
    description="Search travel knowledge base for tips"
)
```

3. Agent can now query knowledge base!

## Best Practices

1. **Clear Tool Descriptions**: Agent needs to understand when to use each tool
2. **Structured Output**: Use JSON for consistent parsing
3. **Error Messages**: Informative errors help agent adapt
4. **Context Limits**: Keep observations concise
5. **Iteration Limit**: Prevent runaway loops
6. **Validation**: Check tool outputs before using them

## Monitoring and Debugging

### Logs to Watch

```
INFO: Starting trip planning for Paris, France
INFO: Agent iteration 1/10
INFO: Tool called: get_coordinates
INFO: Tool result: success
INFO: Agent iteration 2/10
INFO: Tool called: get_weather
...
INFO: Trip planning completed successfully
```

### Common Issues

**Agent loops infinitely:**
- Check max_iterations setting
- Review tool outputs (might be confusing)

**Agent doesn't use tools:**
- Improve tool descriptions
- Check prompt clarity

**Output format wrong:**
- Strengthen output requirements in prompt
- Add validation in post-processing

## Conclusion

This agentic architecture provides:
- **Flexibility**: Agent adapts to different destinations
- **Intelligence**: Reasoning about trade-offs
- **Extensibility**: Easy to add new tools
- **Robustness**: Handles errors gracefully
- **Transparency**: Verbose mode shows reasoning

The ReAct pattern enables the agent to be much more than a simple API wrapper—it's an intelligent system that truly "thinks" about how to create the best trip for each user.
