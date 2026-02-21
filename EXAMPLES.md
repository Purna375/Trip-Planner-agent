# Sample Trip Planning Request

This file contains example API requests you can use to test the AI Trip Planner.

**Note**: Make sure you have set your `GROQ_API_KEY` in the `.env` file before testing.
Get your free API key at: https://console.groq.com

## Example 1: Paris Weekend Getaway

```json
{
  "destination": "Paris, France",
  "start_date": "2024-07-20",
  "end_date": "2024-07-23",
  "budget": 1500.0,
  "travelers": 2,
  "interests": ["culture", "food", "museums", "architecture", "art"],
  "pace": "balanced"
}
```

## Example 2: Tokyo Adventure

```json
{
  "destination": "Tokyo, Japan",
  "start_date": "2024-08-15",
  "end_date": "2024-08-22",
  "budget": 3000.0,
  "travelers": 1,
  "interests": ["food", "culture", "local_life", "shopping", "nightlife"],
  "pace": "packed"
}
```

## Example 3: Barcelona Beach & Culture

```json
{
  "destination": "Barcelona, Spain",
  "start_date": "2024-09-10",
  "end_date": "2024-09-15",
  "budget": 2000.0,
  "travelers": 4,
  "interests": ["beaches", "architecture", "food", "culture", "nightlife"],
  "pace": "relaxed"
}
```

## Example 4: Rome Historical Tour

```json
{
  "destination": "Rome, Italy",
  "start_date": "2024-10-05",
  "end_date": "2024-10-09",
  "budget": 1800.0,
  "travelers": 2,
  "interests": ["history", "culture", "food", "architecture", "art"],
  "pace": "balanced"
}
```

## Example 5: New York City Experience

```json
{
  "destination": "New York City, USA",
  "start_date": "2024-11-15",
  "end_date": "2024-11-20",
  "budget": 2500.0,
  "travelers": 3,
  "interests": ["museums", "shopping", "food", "culture", "nightlife"],
  "pace": "packed"
}
```

## Testing with cURL

```bash
# Test with Paris example
curl -X POST http://localhost:8000/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "start_date": "2024-07-20",
    "end_date": "2024-07-23",
    "budget": 1500.0,
    "travelers": 2,
    "interests": ["culture", "food", "museums"],
    "pace": "balanced"
  }'
```

## Testing with Python

```python
import requests

url = "http://localhost:8000/api/plan-trip"

request_data = {
    "destination": "Paris, France",
    "start_date": "2024-07-20",
    "end_date": "2024-07-23",
    "budget": 1500.0,
    "travelers": 2,
    "interests": ["culture", "food", "museums"],
    "pace": "balanced"
}

response = requests.post(url, json=request_data)
print(response.json())
```

## Valid Field Values

### Destination
- Any city or location name
- Best format: "City, Country" (e.g., "Paris, France")

### Dates
- Format: YYYY-MM-DD
- End date must be after start date

### Budget
- Any positive number >= 100
- Currency: USD

### Travelers
- Any integer between 1 and 20

### Interests (choose any combination)
- culture
- history
- food
- nature
- adventure
- museums
- art
- shopping
- nightlife
- beaches
- architecture
- photography
- hiking
- local_life

### Pace
- "relaxed": 2 activities per day
- "balanced": 3 activities per day (recommended)
- "packed": 4+ activities per day
