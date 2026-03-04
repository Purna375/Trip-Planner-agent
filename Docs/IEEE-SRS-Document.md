# Software Requirements Specification (SRS)
## AI Trip Planner Web Application

**Document Version:** 1.0  
**Date:** February 21, 2026  
**Project Name:** AI Trip Planner  
**Project Version:** 2.0 (Fast Mode)  

**Prepared By:**  
Development Team  

**Document Status:** Final  

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Document Conventions](#12-document-conventions)
   - 1.3 [Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
   - 1.4 [Project Scope](#14-project-scope)
   - 1.5 [References](#15-references)

2. [Overall Description](#2-overall-description)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [Product Functions](#22-product-functions)
   - 2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
   - 2.4 [Operating Environment](#24-operating-environment)
   - 2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   - 2.6 [User Documentation](#26-user-documentation)
   - 2.7 [Assumptions and Dependencies](#27-assumptions-and-dependencies)

3. [External Interface Requirements](#3-external-interface-requirements)
   - 3.1 [User Interfaces](#31-user-interfaces)
   - 3.2 [Hardware Interfaces](#32-hardware-interfaces)
   - 3.3 [Software Interfaces](#33-software-interfaces)
   - 3.4 [Communications Interfaces](#34-communications-interfaces)

4. [System Features](#4-system-features)
   - 4.1 [Trip Planning Request](#41-trip-planning-request)
   - 4.2 [Itinerary Generation](#42-itinerary-generation)
   - 4.3 [PDF Export](#43-pdf-export)
   - 4.4 [Error Handling](#44-error-handling)

5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   - 5.1 [Performance Requirements](#51-performance-requirements)
   - 5.2 [Safety Requirements](#52-safety-requirements)
   - 5.3 [Security Requirements](#53-security-requirements)
   - 5.4 [Software Quality Attributes](#54-software-quality-attributes)
   - 5.5 [Business Rules](#55-business-rules)

6. [Other Requirements](#6-other-requirements)

7. [Appendix A: Glossary](#appendix-a-glossary)

8. [Appendix B: Analysis Models](#appendix-b-analysis-models)

9. [Appendix C: To Be Determined List](#appendix-c-to-be-determined-list)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the requirements for the AI Trip Planner web application. It describes the functional and non-functional requirements, system behavior, design constraints, and external interfaces of the system.

The document is intended for:
- Development team members who will implement the system
- Quality assurance team who will test the system
- Project managers who will oversee the development
- Stakeholders who need to understand system capabilities

### 1.2 Document Conventions

**Priority Levels:**
- **High Priority:** Essential for system operation, must be implemented
- **Medium Priority:** Important but system can function with workarounds
- **Low Priority:** Nice-to-have features for future releases

**Typographic Conventions:**
- `Code snippets` - Technical implementation details
- **Bold text** - Key terms and emphasis
- *Italic text* - External system references
- [Links] - References to other sections

**Requirement Identifiers:**
- **FR-XXX** - Functional Requirements
- **NFR-XXX** - Non-Functional Requirements
- **UI-XXX** - User Interface Requirements
- **EXT-XXX** - External Interface Requirements

### 1.3 Intended Audience and Reading Suggestions

**For Developers:**
- Focus on Sections 3 (External Interfaces) and 4 (System Features)
- Review design constraints in Section 2.5
- Check technical dependencies in Section 2.7

**For Testers:**
- Focus on Section 4 (System Features) for test cases
- Review Section 5 (Non-Functional Requirements) for performance testing
- Check Section 3.1 for UI validation scenarios

**For Project Managers:**
- Read Section 1.4 (Project Scope) for overview
- Review Section 2 (Overall Description) for product context
- Check Section 5.1 (Performance Requirements) for acceptance criteria

**For Stakeholders:**
- Start with Section 1.4 (Project Scope)
- Review Section 2.2 (Product Functions)
- Check Section 5.4 (Quality Attributes)

### 1.4 Project Scope

**Product Name:** AI Trip Planner

**Product Vision:**  
To provide travelers with intelligent, personalized trip itineraries within seconds by leveraging AI technology and real-time data from multiple sources, eliminating the need for manual research and planning.

**Key Objectives:**
1. Generate comprehensive 1-30 day trip itineraries in 5-10 seconds
2. Provide accurate, real-time weather and location data
3. Stay within user-specified budget constraints
4. Offer professional, emoji-free user interface
5. Enable PDF export for offline access
6. Achieve 99%+ success rate in itinerary generation

**Scope Boundaries:**

**In Scope:**
- Single-destination trip planning
- Budget-based itinerary generation
- Weather-aware activity recommendations
- Points of interest (POI) integration
- PDF itinerary export
- Professional web-based user interface
- Fast mode with single AI call (5-10 second response)

**Out of Scope:**
- Multi-destination tours
- Flight/hotel booking integration
- Real-time booking and reservations
- User authentication and profiles
- Itinerary saving and history
- Social sharing features
- Mobile native applications
- Collaborative planning with multiple users
- Payment processing

**Success Metrics:**
- Response time: 5-10 seconds per request
- Success rate: 99%+ valid itineraries
- User satisfaction: Professional UI without emojis
- Cost efficiency: ~$0.001 per itinerary
- API reliability: 99.5% uptime

### 1.5 References

**Standards:**
- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- RFC 7231: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content
- OpenAPI Specification 3.0

**External APIs:**
- OpenStreetMap Nominatim API Documentation: https://nominatim.org/release-docs/latest/api/
- Open-Meteo Weather API: https://open-meteo.com/en/docs
- Overpass API Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API
- Groq API Documentation: https://console.groq.com/docs/

**Technologies:**
- FastAPI Framework: https://fastapi.tiangolo.com/
- Pydantic Validation: https://docs.pydantic.dev/
- LangChain Documentation: https://python.langchain.com/
- jsPDF Library: https://github.com/parallax/jsPDF

**Project Documentation:**
- Architecture Diagrams: architecture-diagram.puml
- Sequence Diagrams: sequence-diagram.puml
- Data Models: data-models-diagram.puml
- Project Structure: project-structure-diagram.puml

---

## 2. Overall Description

### 2.1 Product Perspective

The AI Trip Planner is a **standalone web application** that operates as an independent system with integration to multiple external APIs. It is not part of a larger system or product family.

**System Context:**

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Browser                      │
│                (User's Device - Any OS)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              AI Trip Planner Application                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Frontend (HTML/CSS/JavaScript)                    │ │
│  │  - Trip Form                                        │ │
│  │  - Results Display                                  │ │
│  │  - PDF Generator                                    │ │
│  └──────────────┬─────────────────────────────────────┘ │
│                 │ REST API (JSON)                        │
│  ┌──────────────▼─────────────────────────────────────┐ │
│  │  Backend (Python/FastAPI)                          │ │
│  │  - Request Validation                               │ │
│  │  - Business Logic                                   │ │
│  │  - External API Integration                         │ │
│  └──────────────┬─────────────────────────────────────┘ │
└─────────────────┼─────────────────────────────────────────┘
                  │ HTTPS API Calls
      ┌───────────┼───────────┬───────────────┐
      ↓           ↓           ↓               ↓
┌──────────┐ ┌─────────┐ ┌─────────┐  ┌──────────┐
│OpenStreet│ │Open-Meteo│ │Overpass│  │ Groq API │
│   Map    │ │ Weather │ │   API   │  │  (LLM)   │
│Nominatim │ │         │ │         │  │          │
└──────────┘ └─────────┘ └─────────┘  └──────────┘
```

**Key Characteristics:**
- **Client-Server Architecture:** Browser-based frontend communicates with Python backend
- **Stateless Design:** Each request is independent, no session management
- **API Orchestration:** Backend coordinates multiple external services
- **Single-Page Application:** No page reloads, dynamic content updates

**Interfaces with External Systems:**
1. OpenStreetMap Nominatim (Geocoding)
2. Open-Meteo (Weather forecasting)
3. Overpass API (Points of interest)
4. Groq API (AI language model)

### 2.2 Product Functions

**Primary Functions:**

**F-1: Trip Planning Input**
- Accept destination, dates, budget, number of travelers
- Accept travel interests (culture, food, nature, etc.)
- Accept travel pace preference (relaxed, balanced, packed)
- Validate input data client-side and server-side

**F-2: Intelligent Itinerary Generation**
- Calculate trip duration and daily budgets
- Fetch real-time location coordinates
- Retrieve weather forecasts for travel dates
- Find points of interest based on user interests
- Generate day-by-day itinerary using AI
- Allocate activities to morning/afternoon/evening slots
- Estimate costs for each activity
- Consider weather conditions for activity planning

**F-3: Smart Recommendations**
- Generate weather-appropriate packing lists
- Provide weather tips for each day
- Suggest alternate activities
- Offer local travel tips and cultural information

**F-4: Results Display**
- Show comprehensive trip overview
- Display day-by-day itinerary with details
- Present activity descriptions, durations, and costs
- Show recommendations in organized sections

**F-5: PDF Export**
- Generate formatted PDF document
- Include all itinerary details
- Support multi-page layouts
- Auto-download to user's device

**F-6: Error Management**
- Handle invalid inputs gracefully
- Display user-friendly error messages
- Provide retry mechanisms
- Log errors for debugging

### 2.3 User Classes and Characteristics

**UC-1: Individual Travelers**
- **Frequency of Use:** Occasional (1-5 times per year)
- **Technical Expertise:** Basic to intermediate computer skills
- **Primary Goals:** Quick, personalized trip planning
- **Characteristics:** Budget-conscious, time-limited, needs comprehensive information
- **Priority:** High

**UC-2: Travel Enthusiasts**
- **Frequency of Use:** Regular (monthly)
- **Technical Expertise:** Intermediate to advanced
- **Primary Goals:** Explore new destinations, detailed planning
- **Characteristics:** Adventurous, values AI recommendations, tech-savvy
- **Priority:** High

**UC-3: Professional Travel Planners**
- **Frequency of Use:** Daily
- **Technical Expertise:** Advanced
- **Primary Goals:** Quick itinerary generation for clients
- **Characteristics:** Needs professional output, PDF export critical, accuracy essential
- **Priority:** Medium

**UC-4: Casual Users / First-Time Visitors**
- **Frequency of Use:** One-time or rare
- **Technical Expertise:** Basic
- **Primary Goals:** Simple, easy-to-understand travel plan
- **Characteristics:** Needs guidance, prefers visual clarity, may not understand technical terms
- **Priority:** Medium

### 2.4 Operating Environment

**Client-Side Environment:**

**Supported Web Browsers:**
- Google Chrome 90+ (Primary)
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+ (macOS/iOS)
- Opera 76+

**Operating Systems:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora 34+)
- iOS 14+
- Android 10+

**Hardware Requirements (Client):**
- Processor: 1 GHz or faster
- RAM: 2 GB minimum
- Display: 1024x768 minimum resolution
- Network: Stable internet connection (minimum 1 Mbps)

**Server-Side Environment:**

**Operating System:**
- Linux (Ubuntu 20.04 LTS or later) - Primary
- Windows Server 2019+ - Secondary
- macOS (development only)

**Runtime Environment:**
- Python 3.11 or higher
- Node.js (for jsPDF CDN) - Client-side only

**Hardware Requirements (Server):**
- CPU: 2 cores minimum, 4 cores recommended
- RAM: 4 GB minimum, 8 GB recommended
- Storage: 10 GB minimum
- Network: 100 Mbps minimum bandwidth

**Dependencies:**
- FastAPI web framework
- Uvicorn ASGI server
- Pydantic validation library
- LangChain and LangChain-Groq
- httpx async HTTP client
- python-dotenv for configuration

### 2.5 Design and Implementation Constraints

**C-1: Technology Stack Constraints**
- **Backend:** Must use Python 3.11+ with FastAPI framework
- **Frontend:** Must use vanilla JavaScript (no frameworks like React/Vue)
- **AI Provider:** Must use Groq API with llama-3.1-8b-instant model
- **Styling:** Must use pure CSS without preprocessors (no SCSS/LESS)

**C-2: API Dependencies**
- Must rely on free-tier external APIs (OpenStreetMap, Open-Meteo, Overpass)
- No paid geocoding services (Google Maps API not allowed)
- Limited to Groq API rate limits (14,400 requests/day on free tier)

**C-3: Performance Constraints**
- Backend response time must not exceed 10 seconds
- Single LLM call per request (no chaining)
- JSON response size limited to 50 KB
- Client-side PDF generation (no server-side rendering)

**C-4: UI/UX Constraints**
- **No emoji characters** anywhere in the interface (user requirement)
- Must use professional, corporate-ready design
- Must use Inter font family exclusively
- No mode selection UI (fast mode is default and only option)

**C-5: Data Constraints**
- No user authentication or data storage
- Stateless request/response (no sessions)
- No caching of itineraries
- No personal data collection

**C-6: Security Constraints**
- API keys must be stored in environment variables
- No sensitive data in client-side code
- CORS must be properly configured
- HTTPS required for production deployment

**C-7: Licensing Constraints**
- All external APIs must allow commercial use
- Open-source libraries must be compatible (MIT, Apache 2.0)
- No GPL-licensed dependencies (to avoid copyleft)

**C-8: Resource Constraints**
- Development team: Small team (1-3 developers)
- Timeline: Rapid development cycle
- Budget: Free-tier API limits
- Infrastructure: Single server deployment

### 2.6 User Documentation

**Documentation Provided:**

**D-1: README.md**
- Installation instructions
- Configuration guide
- Quick start guide
- API key setup
- Troubleshooting section

**D-2: DIAGRAMS-README.md**
- How to view PlantUML diagrams
- Architecture overview
- System flow explanation
- Performance metrics

**D-3: IEEE SRS Document (This Document)**
- Complete requirements specification
- System architecture
- Functional requirements
- Non-functional requirements

**D-4: Inline Code Documentation**
- Docstrings for all Python functions
- JSDoc comments for JavaScript functions
- CSS comments for component styles
- Configuration file explanations

**D-5: PlantUML Diagrams**
- Architecture diagram (component view)
- Sequence diagram (execution flow)
- Data models diagram (schemas)
- Project structure diagram (file organization)

**Documentation Not Provided:**
- End-user tutorial videos
- Interactive help system
- Context-sensitive help
- Multi-language documentation

### 2.7 Assumptions and Dependencies

**Assumptions:**

**A-1: User Assumptions**
- Users have basic computer literacy
- Users have stable internet connection
- Users understand English language
- Users have modern web browsers with JavaScript enabled

**A-2: Technical Assumptions**
- External APIs remain available and free
- API response formats remain consistent
- LLM continues to support JSON mode
- Browser standards remain compatible

**A-3: Business Assumptions**
- Free-tier API limits are sufficient
- No legal restrictions on AI-generated content
- No liability for travel recommendations
- Users self-manage their trip bookings

**Dependencies:**

**D-1: External API Dependencies**
- **OpenStreetMap Nominatim** (High Priority)
  - Provides geocoding services
  - Free, community-maintained
  - Alternative: MapBox Geocoding API (requires migration)

- **Open-Meteo Weather API** (High Priority)
  - Provides weather forecasts
  - Free, unlimited requests
  - Alternative: WeatherAPI.com (has free tier)

- **Overpass API** (Medium Priority)
  - Provides POI data from OpenStreetMap
  - Free, community-maintained
  - Alternative: Google Places API (paid), Foursquare API

- **Groq API** (Critical Priority)
  - Provides LLM inference
  - Free tier: 14,400 requests/day
  - Alternative: OpenAI API (paid), Anthropic Claude (paid)

**D-2: Library Dependencies**
- **FastAPI:** ASGI web framework (Critical)
- **Pydantic:** Data validation (Critical)
- **LangChain:** LLM wrapper (High)
- **httpx:** Async HTTP client (High)
- **jsPDF:** Client-side PDF generation (Medium)

**D-3: Infrastructure Dependencies**
- **Python 3.11+:** Runtime environment (Critical)
- **Uvicorn:** ASGI server (Critical)
- **Modern Browser:** Client execution environment (Critical)

**D-4: Development Dependencies**
- **Git:** Version control (High)
- **VS Code:** Development environment (Medium)
- **PlantUML:** Diagram generation (Low)

**Risk Mitigation:**
- Monitor external API health and deprecation notices
- Implement fallback mechanisms for non-critical APIs
- Design modular architecture for easy provider switching
- Document alternative APIs for each dependency

---

## 3. External Interface Requirements

### 3.1 User Interfaces

**UI-1: Trip Planning Form**

**Description:** Primary input interface for trip details

**Layout:**
- Header with "TripPlanner" branding and "AI Powered" badge
- Tagline: "Intelligent travel planning in seconds"
- Form organized in three sections: Destination & Dates, Travel Details, Interests
- Single "Generate Itinerary" button at bottom

**Input Fields:**

| Field Name | Type | Constraints | Default | Required |
|------------|------|-------------|---------|----------|
| Destination | Text | 3-100 characters | None | Yes |
| Start Date | Date Picker | Today or future | None | Yes |
| End Date | Date Picker | After start date | None | Yes |
| Budget (USD) | Number | Min: 100, Step: 50 | None | Yes |
| Travelers | Number | Min: 1, Max: 20 | 2 | Yes |
| Interests | Checkboxes | Multi-select | culture, food | No |
| Pace | Dropdown | 3 options | balanced | Yes |

**Interest Options:**
- Culture
- History
- Food & Dining
- Nature
- Adventure
- Museums
- Art
- Shopping
- Nightlife
- Local Life

**Pace Options:**
- Relaxed (2 activities/day)
- Balanced (3 activities/day)
- Packed (4 activities/day)

**Validation Messages:**
- "Please enter a destination"
- "Please select travel dates"
- "End date must be after start date"
- "Please enter a valid budget (minimum $100)"

**Visual Design:**
- Inter font family (weights: 300, 400, 500, 600, 700)
- Primary color: #2563eb (blue)
- Background: #ffffff (white) with #f8fafc (light gray) accents
- Form fields: Light border, rounded corners
- Chips for interests: Clickable with checkbox inside
- Professional, clean layout with consistent spacing

**UI-2: Loading Screen**

**Description:** Animated feedback during itinerary generation

**Components:**
- Centered loading spinner (CSS animation)
- Title: "Creating Your Itinerary"
- Subtitle: "Analyzing destinations, weather, and attractions..."
- Progress bar showing completion (0% → 90% → 100%)

**Behavior:**
- Appears immediately after form submission
- Progress bar animates smoothly from 0% to 90% over ~3 seconds
- Completes to 100% when response received
- Fades out as results appear

**Visual Design:**
- Semi-transparent background overlay
- Centered card with shadow
- Blue spinning loader
- Smooth animations (0.3s transitions)

**UI-3: Results Display**

**Description:** Comprehensive itinerary presentation

**Layout Sections:**

**3.1 Results Header:**
- Destination name (large, bold)
- Trip metadata (duration, travelers, budget)
- Action buttons: "Plan Another Trip", "Download PDF"

**3.2 Trip Overview Card:**
- 6-column grid (responsive to 2 columns on mobile)
- Displays: Destination, Duration, Travelers, Total Budget, Daily Budget, Weather
- Small labels, large values
- Professional typography hierarchy

**3.3 Daily Itinerary:**
- Day cards in vertical list
- Each card contains:
  - Day number and date (large header)
  - Weather condition for the day
  - Three activity blocks (Morning, Afternoon, Evening)
  - Travel time and total daily cost footer
  - Optional notes section (italic text)

**Activity Block Structure:**
- Time badge (colored: morning=orange, afternoon=yellow, evening=purple)
- Activity name (bold, large)
- Description (regular text)
- Metadata: Duration, Cost, Location (small text, gray)

**3.4 Recommendations Grid:**
- 4-column responsive grid (1 column on mobile)
- Cards for: Packing List, Weather Tips, Alternate Activities, Local Tips
- Bullet lists with clear typography

**Visual Design:**
- Card-based layout with shadows
- Consistent spacing (1rem, 1.5rem, 2rem)
- Professional color scheme (blues, grays)
- No emoji characters anywhere
- Responsive breakpoints at 768px and 1024px

**UI-4: Error Display**

**Description:** User-friendly error messages

**Components:**
- Error icon (SVG, red color)
- Error message (large, clear text)
- Detailed explanation (if available)
- "Try Again" button

**Error Messages:**
- "Request failed: [specific error]"
- "Could not find location: [destination]"
- "Service temporarily unavailable"
- "Invalid request. Please check your inputs."

**Visual Design:**
- Red accent color (#ef4444)
- Centered card layout
- Clear call-to-action button

**UI-5: PDF Output**

**Description:** Downloadable PDF document

**Format:**
- A4 page size (210mm × 297mm)
- 20mm margins on all sides
- Multi-page document (auto page breaks)

**Content Structure:**
1. Title page with destination and dates
2. Trip overview section
3. Day-by-day itinerary (one page per 1-2 days)
4. Recommendations section

**Typography:**
- Title: 20pt bold
- Headings: 14pt bold
- Subheadings: 12pt bold
- Body text: 10pt regular
- Metadata: 9pt regular

**Visual Design:**
- Black text on white background
- Proper spacing between sections
- Bullet points for lists
- Clear hierarchy with font sizes

### 3.2 Hardware Interfaces

**HI-1: Client Device Display**

**Screen Resolution Support:**
- Minimum: 1024 × 768 (tablet)
- Optimal: 1920 × 1080 (desktop)
- Maximum tested: 3840 × 2160 (4K)

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Touch Interface:**
- All interactive elements minimum 44×44 pixels (iOS guidelines)
- Touch targets properly spaced
- Swipe gestures not required (click-based navigation)

**HI-2: Client Device Input**

**Keyboard:**
- All form fields keyboard-accessible
- Tab navigation supported
- Enter key submits form

**Mouse/Trackpad:**
- All interactive elements have hover states
- Cursor changes to pointer on clickable elements
- Scroll wheel supported for long content

**Touch Screen:**
- Tap gestures for all interactions
- No hover-dependent functionality
- Virtual keyboard auto-displays for text inputs

**HI-3: Network Interface**

**Bandwidth Requirements:**
- Minimum: 1 Mbps download, 512 Kbps upload
- Recommended: 5 Mbps download, 1 Mbps upload

**Latency Tolerance:**
- Maximum acceptable latency: 500ms to server
- Timeout settings: 30 seconds for API requests

**Data Transfer:**
- Average request size: ~1 KB
- Average response size: ~20 KB
- PDF download: ~50-200 KB

### 3.3 Software Interfaces

**SI-1: OpenStreetMap Nominatim API**

**Purpose:** Geocoding (convert location names to coordinates)

**Interface Type:** RESTful HTTP API

**Connection:**
- Protocol: HTTPS
- Base URL: `https://nominatim.openstreetmap.org`
- Authentication: None
- Rate Limit: 1 request/second

**Request Format:**
```
GET /search?q={destination}&format=json&limit=1
Headers:
  User-Agent: AI-Trip-Planner/2.0
```

**Response Format:** JSON array
```json
[{
  "lat": "51.5074456",
  "lon": "-0.1277653",
  "display_name": "London, Greater London, England, UK",
  "importance": 0.9
}]
```

**Error Handling:**
- 404: Location not found
- 429: Rate limit exceeded
- 503: Service unavailable

**Data Used:** lat, lon, display_name

**SI-2: Open-Meteo Weather API**

**Purpose:** Weather forecasting

**Interface Type:** RESTful HTTP API

**Connection:**
- Protocol: HTTPS
- Base URL: `https://api.open-meteo.com`
- Authentication: None
- Rate Limit: Unlimited (free tier)

**Request Format:**
```
GET /v1/forecast?latitude={lat}&longitude={lon}&start_date={date}&end_date={date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto
```

**Response Format:** JSON object
```json
{
  "daily": {
    "time": ["2026-02-21", "2026-02-22"],
    "temperature_2m_max": [12.5, 11.8],
    "temperature_2m_min": [6.2, 5.8],
    "precipitation_sum": [0.0, 2.5],
    "weathercode": [3, 61]
  },
  "timezone": "Europe/London"
}
```

**Weather Codes:**
- 0: Clear sky
- 1-3: Partly cloudy to overcast
- 45-48: Fog
- 51-67: Rain (various intensities)
- 71-86: Snow
- 95-99: Thunderstorm

**Data Used:** All daily forecast fields

**SI-3: Overpass API (OpenStreetMap)**

**Purpose:** Points of Interest (POI) search

**Interface Type:** RESTful HTTP API with custom query language

**Connection:**
- Protocol: HTTPS
- Base URL: `https://overpass-api.de`
- Authentication: None
- Rate Limit: Fair use policy

**Request Format:**
```
POST /api/interpreter
Content-Type: application/x-www-form-urlencoded

data=[out:json];(node["tourism"~"museum|attraction"](around:5000,{lat},{lon}););out body;
```

**Response Format:** JSON object
```json
{
  "elements": [{
    "type": "node",
    "id": 1234567,
    "lat": 51.5194,
    "lon": -0.1270,
    "tags": {
      "name": "British Museum",
      "tourism": "museum"
    }
  }]
}
```

**POI Categories Searched:**
- tourism: museum, attraction, artwork, viewpoint
- amenity: restaurant, cafe, bar
- historic: castle, monument, memorial
- leisure: park, garden

**Data Used:** name, type (tags), lat, lon

**SI-4: Groq LLM API**

**Purpose:** AI-powered itinerary formatting

**Interface Type:** RESTful HTTP API (OpenAI-compatible)

**Connection:**
- Protocol: HTTPS
- Base URL: `https://api.groq.com`
- Authentication: Bearer token (API key)
- Rate Limit: 14,400 requests/day (free tier)

**Request Format:**
```json
POST /openai/v1/chat/completions
Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json

Body:
{
  "model": "llama-3.1-8b-instant",
  "messages": [
    {"role": "user", "content": "{prompt}"}
  ],
  "temperature": 0.7,
  "response_format": {"type": "json_object"}
}
```

**Response Format:** JSON object
```json
{
  "choices": [{
    "message": {
      "content": "{json_string}"
    }
  }]
}
```

**Model Parameters:**
- Model: llama-3.1-8b-instant
- Temperature: 0.7 (balanced creativity)
- JSON mode: Enforced
- Max tokens: 4096 (default)

**Error Handling:**
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: Server error

**Data Used:** message.content (parsed as JSON)

**SI-5: jsPDF Library**

**Purpose:** Client-side PDF generation

**Interface Type:** JavaScript library (CDN)

**Connection:**
- Protocol: HTTPS
- CDN URL: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- Version: 2.5.1

**Integration:**
```javascript
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.text("Hello", 10, 10);
doc.save("file.pdf");
```

**Methods Used:**
- `new jsPDF()` - Initialize document
- `setFontSize(size)` - Set text size
- `setFont(font, style)` - Set font family
- `text(content, x, y)` - Add text
- `splitTextToSize(text, width)` - Wrap text
- `addPage()` - Add new page
- `save(filename)` - Download PDF

**Data Output:** Binary PDF file (application/pdf)

### 3.4 Communications Interfaces

**CI-1: HTTP/HTTPS Protocol**

**Client-to-Server Communication:**
- Protocol: HTTP/1.1 with optional HTTP/2
- Port: 8000 (development), 443 (production)
- Encryption: TLS 1.2 or higher (production)
- Content-Type: application/json

**Request Methods Used:**
- GET: Health check endpoint
- POST: Trip planning endpoint
- OPTIONS: CORS preflight

**Response Status Codes:**
- 200 OK: Successful request
- 400 Bad Request: Validation error
- 422 Unprocessable Entity: Pydantic validation failed
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Backend error
- 503 Service Unavailable: External API failure

**CI-2: CORS Configuration**

**Allowed Origins:**
- Development: `http://localhost:*`, `file://`
- Production: Specific domain whitelist

**Allowed Methods:**
- GET, POST, OPTIONS

**Allowed Headers:**
- Content-Type, Authorization

**Credentials:** Not allowed (no cookies)

**CI-3: JSON Data Format**

**Request Body Example:**
```json
{
  "destination": "London",
  "start_date": "2026-02-21",
  "end_date": "2026-02-28",
  "budget": 2000,
  "travelers": 2,
  "interests": ["culture", "food"],
  "pace": "balanced"
}
```

**Response Body Example:**
```json
{
  "overview": {
    "destination": "London",
    "duration": 8,
    "total_budget": 2000.0,
    "daily_budget": 250.0
  },
  "itinerary": [...],
  "smart_additions": {...}
}
```

**Character Encoding:** UTF-8

**Date Format:** ISO 8601 (YYYY-MM-DD)

**Number Format:** JSON numbers (no thousands separators)

**CI-4: Error Response Format**

**Standardized Error Structure:**
```json
{
  "detail": "Could not find location: Atlantis",
  "error_type": "LocationNotFound",
  "status_code": 400
}
```

**CI-5: Logging Communication**

**Log Levels:**
- INFO: Successful operations
- WARNING: Degraded performance
- ERROR: Failed operations
- DEBUG: Detailed diagnostic (development only)

**Log Format:**
```
LEVEL:module:message
timestamp | level | source | message
```

**Log Destinations:**
- Development: stdout/stderr
- Production: File rotation with daily archives

---

## 4. System Features

### 4.1 Trip Planning Request

**Priority:** High

**Description:**  
User submits trip details through web form, system validates input and initiates itinerary generation process.

#### 4.1.1 Stimulus/Response Sequences

**Stimulus:** User fills form and clicks "Generate Itinerary"

**Response Sequence:**
1. Client-side validation executes
2. If valid: form submits, loading screen appears
3. HTTP POST request sent to backend
4. Server validates request with Pydantic
5. If valid: process begins, 200 OK returned
6. If invalid: 422 error with details returned

#### 4.1.2 Functional Requirements

**FR-1.1: Input Validation - Destination**
- **Description:** System shall validate destination field
- **Input:** Text string (destination name)
- **Process:** 
  - Check non-empty
  - Length between 3-100 characters
  - Strip leading/trailing whitespace
- **Output:** Valid string or error message
- **Priority:** High

**FR-1.2: Input Validation - Dates**
- **Description:** System shall validate date inputs
- **Input:** Start date and end date
- **Process:**
  - Check both dates provided
  - Verify date format (YYYY-MM-DD)
  - Ensure start_date >= today
  - Ensure end_date > start_date
  - Calculate duration (1-30 days)
- **Output:** Valid dates or error message
- **Priority:** High

**FR-1.3: Input Validation - Budget**
- **Description:** System shall validate budget input
- **Input:** Numeric value (USD)
- **Process:**
  - Check numeric type
  - Verify minimum $100
  - Round to 2 decimal places
- **Output:** Valid float or error message
- **Priority:** High

**FR-1.4: Input Validation - Travelers**
- **Description:** System shall validate traveler count
- **Input:** Integer value
- **Process:**
  - Check integer type
  - Verify minimum 1
  - Verify maximum 20
- **Output:** Valid integer or error message
- **Priority:** High

**FR-1.5: Input Validation - Interests**
- **Description:** System shall validate interest selections
- **Input:** Array of interest strings
- **Process:**
  - Accept empty array (default to ["culture", "local_life"])
  - Verify each interest in allowed list
  - Remove duplicates
- **Output:** Valid array or error message
- **Priority:** Medium

**FR-1.6: Input Validation - Pace**
- **Description:** System shall validate pace selection
- **Input:** String value
- **Process:**
  - Check value in ["relaxed", "balanced", "packed"]
  - Default to "balanced" if not provided
- **Output:** Valid string or error message
- **Priority:** Medium

**FR-1.7: Request Serialization**
- **Description:** System shall serialize validated data to JSON
- **Input:** Validated form fields
- **Process:**
  - Convert to JSON format
  - Use ISO 8601 for dates
  - UTF-8 encoding
- **Output:** JSON string
- **Priority:** High

**FR-1.8: HTTP Communication**
- **Description:** System shall send POST request to backend
- **Input:** JSON request body
- **Process:**
  - POST to /api/plan-trip
  - Set Content-Type: application/json
  - Timeout after 30 seconds
- **Output:** HTTP response or timeout error
- **Priority:** High

### 4.2 Itinerary Generation

**Priority:** High

**Description:**  
Backend processes trip request by fetching external data, calling LLM once, and generating structured itinerary response.

#### 4.2.1 Stimulus/Response Sequences

**Stimulus:** Valid trip request received at backend

**Response Sequence:**
1. Calculate trip metrics (duration, daily budget, date range)
2. Fetch coordinates from OpenStreetMap (300ms)
3. Fetch weather data from Open-Meteo (400ms)
4. Fetch POIs from Overpass API (800ms)
5. Format data for LLM prompt
6. Make single LLM call to Groq (2500ms)
7. Parse and validate JSON response
8. Build TripResponse object
9. Return JSON response to client

**Total Time:** 5-10 seconds

#### 4.2.2 Functional Requirements

**FR-2.1: Trip Metrics Calculation**
- **Description:** System shall calculate basic trip metrics
- **Input:** start_date, end_date, budget
- **Process:**
  - duration = (end_date - start_date).days + 1
  - daily_budget = budget / duration
  - date_range = [list of dates]
- **Output:** Numeric values
- **Priority:** High

**FR-2.2: Geocoding Service**
- **Description:** System shall convert destination to coordinates
- **Input:** Destination string
- **Process:**
  - Query OpenStreetMap Nominatim
  - Parse first result
  - Extract lat, lon, display_name
  - Handle "not found" errors
- **Output:** Coordinates dict or error
- **Priority:** High

**FR-2.3: Weather Forecast Retrieval**
- **Description:** System shall fetch weather forecasts
- **Input:** Coordinates, date range
- **Process:**
  - Query Open-Meteo API
  - Request daily max/min temp, precipitation, weathercode
  - Parse response array
  - Map weathercodes to descriptions
- **Output:** Weather data dict
- **Priority:** High

**FR-2.4: POI Discovery**
- **Description:** System shall find points of interest
- **Input:** Coordinates, interests, radius
- **Process:**
  - Build Overpass QL query
  - Filter by interests (museums, restaurants, etc.)
  - Search within 5km radius
  - Parse elements array
  - Extract name, type, coordinates
- **Output:** POI list (array)
- **Priority:** High

**FR-2.5: Data Formatting for LLM**
- **Description:** System shall format data into comprehensive prompt
- **Input:** All fetched data
- **Process:**
  - Format weather as readable summary
  - Format POIs as numbered list
  - Build structured prompt with all context
  - Include JSON schema in prompt
  - Add constraints (budget, interests, pace)
- **Output:** Prompt string (~3000 tokens)
- **Priority:** High

**FR-2.6: LLM Invocation**
- **Description:** System shall call Groq LLM API
- **Input:** Formatted prompt
- **Process:**
  - Initialize ChatGroq with JSON mode
  - Set temperature to 0.7
  - Invoke with prompt
  - Wait for response (2-3 seconds)
  - Extract content from response
- **Output:** LLM response string
- **Priority:** High

**FR-2.7: JSON Parsing**
- **Description:** System shall parse LLM JSON output
- **Input:** LLM response string
- **Process:**
  - Remove markdown code blocks if present
  - Clean trailing commas with regex
  - Attempt json.loads()
  - If fails: invoke self-healing (ask LLM to fix)
  - Validate structure
- **Output:** Parsed dict or error
- **Priority:** High

**FR-2.8: Response Construction**
- **Description:** System shall build TripResponse object
- **Input:** Parsed LLM data, original request
- **Process:**
  - Create TripOverview
  - Build DayItinerary objects (8 days)
  - Create Activity objects (morning/afternoon/evening)
  - Build SmartAdditions
  - Validate with Pydantic
- **Output:** TripResponse object
- **Priority:** High

**FR-2.9: Activity Cost Calculation**
- **Description:** System shall ensure budget constraints
- **Input:** Activities, daily budget
- **Process:**
  - Sum activity costs per day
  - Verify total stays within budget
  - Flag if over budget (in notes)
- **Output:** Cost summaries
- **Priority:** Medium

**FR-2.10: Weather-Aware Planning**
- **Description:** System shall consider weather in activity selection
- **Input:** Weather forecast, activities
- **Process:**
  - LLM considers weather in prompt
  - Rain days → indoor activities prioritized
  - Clear days → outdoor activities prioritized
- **Output:** Weather-appropriate activities
- **Priority:** Medium

**FR-2.11: Interest-Based Filtering**
- **Description:** System shall align activities with user interests
- **Input:** User interests, POI list
- **Process:**
  - Filter POIs by interest tags
  - Pass filtered list to LLM
  - LLM selects from filtered set
- **Output:** Interest-relevant activities
- **Priority:** Medium

**FR-2.12: Pace-Based Activity Count**
- **Description:** System shall respect pace preference
- **Input:** Pace setting
- **Process:**
  - Relaxed: 2 activities/day
  - Balanced: 3 activities/day
  - Packed: 4 activities/day
  - Inform LLM of activity count
- **Output:** Correct number of activities
- **Priority:** Medium

### 4.3 PDF Export

**Priority:** Medium

**Description:**  
User can download complete itinerary as formatted PDF document for offline access and printing.

#### 4.3.1 Stimulus/Response Sequences

**Stimulus:** User clicks "Download PDF" button

**Response Sequence:**
1. Retrieve trip data from app state
2. Initialize jsPDF instance
3. Add title page with destination
4. Add overview section
5. Loop through days, add itinerary pages
6. Add recommendations section
7. Generate PDF binary
8. Trigger browser download

**Total Time:** <1 second

#### 4.3.2 Functional Requirements

**FR-3.1: PDF Initialization**
- **Description:** System shall initialize PDF document
- **Input:** Trip data object
- **Process:**
  - Create jsPDF instance
  - Set A4 page size
  - Set margins (20mm)
- **Output:** PDF document object
- **Priority:** Medium

**FR-3.2: Title Page Generation**
- **Description:** System shall add title page
- **Input:** Destination, dates
- **Process:**
  - Add title (20pt bold)
  - Add destination name
  - Add date range
  - Add travelers and budget
- **Output:** Updated PDF
- **Priority:** Medium

**FR-3.3: Overview Section**
- **Description:** System shall add trip overview
- **Input:** TripOverview object
- **Process:**
  - Add section heading
  - Add all overview fields
  - Format as key-value pairs
- **Output:** Updated PDF
- **Priority:** Medium

**FR-3.4: Daily Itinerary Pages**
- **Description:** System shall add day-by-day itineraries
- **Input:** Array of DayItinerary objects
- **Process:**
  - For each day:
    - Add day header (day number, date)
    - Add weather info
    - Add morning activity (name, desc, duration, cost)
    - Add afternoon activity
    - Add evening activity
    - Add daily summary (travel time, cost)
    - Check page break
- **Output:** Updated PDF (multi-page)
- **Priority:** Medium

**FR-3.5: Recommendations Section**
- **Description:** System shall add recommendations
- **Input:** SmartAdditions object
- **Process:**
  - Add "Recommendations" heading
  - Add packing list (bulleted)
  - Add weather tips (bulleted)
  - Add alternate activities (bulleted)
  - Add local tips (bulleted)
- **Output:** Updated PDF
- **Priority:** Medium

**FR-3.6: Text Wrapping**
- **Description:** System shall wrap long text
- **Input:** Text strings
- **Process:**
  - Use splitTextToSize(text, maxWidth)
  - Calculate line count
  - Adjust yPosition accordingly
- **Output:** Properly wrapped text
- **Priority:** Medium

**FR-3.7: Page Break Management**
- **Description:** System shall handle multi-page content
- **Input:** Current yPosition, pageHeight
- **Process:**
  - Check if content fits on current page
  - If not: addPage(), reset yPosition
  - Continue adding content
- **Output:** Multi-page PDF
- **Priority:** Medium

**FR-3.8: PDF Download**
- **Description:** System shall trigger file download
- **Input:** PDF document
- **Process:**
  - Generate filename: trip-{destination}-{timestamp}.pdf
  - Call doc.save(filename)
  - Browser downloads file
- **Output:** Downloaded PDF file
- **Priority:** Medium

### 4.4 Error Handling

**Priority:** High

**Description:**  
System gracefully handles errors from user input, external APIs, and LLM failures with clear feedback.

#### 4.4.1 Stimulus/Response Sequences

**Stimulus:** Error occurs during any operation

**Response Sequence:**
1. Catch error/exception
2. Log error details (server-side)
3. Determine error type and user message
4. Display error UI with message
5. Provide retry option
6. Reset loading state

#### 4.4.2 Functional Requirements

**FR-4.1: Input Validation Errors**
- **Description:** System shall display input validation errors
- **Input:** Invalid form data
- **Process:**
  - Catch validation exception
  - Show inline error message
  - Highlight problematic field
  - Keep form data intact
- **Output:** Error message, no API call
- **Priority:** High

**FR-4.2: Network Errors**
- **Description:** System shall handle network failures
- **Input:** Failed HTTP request
- **Process:**
  - Detect timeout or connection error
  - Display: "Network error. Please check your connection."
  - Provide "Retry" button
- **Output:** Error screen
- **Priority:** High

**FR-4.3: Geocoding Errors**
- **Description:** System shall handle location not found
- **Input:** 404 from Nominatim
- **Process:**
  - Catch exception
  - Display: "Could not find location: {destination}"
  - Suggest checking spelling
  - Provide "Try Again" button
- **Output:** Error screen with suggestion
- **Priority:** High

**FR-4.4: Weather API Errors**
- **Description:** System shall handle weather service failures
- **Input:** Error from Open-Meteo
- **Process:**
  - Log error details
  - Display: "Weather service temporarily unavailable"
  - Suggest trying again later
- **Output:** Error screen
- **Priority:** Medium

**FR-4.5: POI API Errors**
- **Description:** System shall handle POI service failures
- **Input:** Error from Overpass API
- **Process:**
  - Log error details
  - Continue with limited POIs
  - Display warning (not blocking)
- **Output:** Partial itinerary or error
- **Priority:** Low

**FR-4.6: LLM API Errors**
- **Description:** System shall handle LLM failures
- **Input:** Error from Groq API
- **Process:**
  - Handle 401: "Invalid API key configuration"
  - Handle 429: "Rate limit exceeded. Try again in a moment."
  - Handle 500: "AI service error. Please retry."
  - Provide "Retry" button
- **Output:** Error screen
- **Priority:** High

**FR-4.7: JSON Parsing Errors**
- **Description:** System shall handle invalid LLM JSON
- **Input:** Malformed JSON from LLM
- **Process:**
  - Attempt self-healing (ask LLM to fix)
  - If still fails: log response, show error
  - Display: "Failed to generate itinerary. Please try again."
- **Output:** Error screen or fixed JSON
- **Priority:** High

**FR-4.8: Server Errors**
- **Description:** System shall handle internal server errors
- **Input:** 500 response from backend
- **Process:**
  - Display: "Internal server error. Our team has been notified."
  - Provide "Retry" button
  - Log full error with stack trace
- **Output:** Error screen
- **Priority:** High

**FR-4.9: Error Logging**
- **Description:** System shall log all errors
- **Input:** Any exception
- **Process:**
  - Log timestamp, error type, message
  - Log request details (no sensitive data)
  - Log stack trace
  - Write to stderr or log file
- **Output:** Log entry
- **Priority:** High

**FR-4.10: Error Recovery**
- **Description:** System shall enable error recovery
- **Input:** User clicks "Retry" or "Try Again"
- **Process:**
  - Reset error state
  - Return to appropriate screen (form or loading)
  - Preserve user input if applicable
  - Reattempt operation
- **Output:** Return to normal flow
- **Priority:** High

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

**NFR-1.1: Response Time**
- **Requirement:** System shall generate itinerary within 10 seconds
- **Measurement:** Time from form submission to results display
- **Target:** 5-7 seconds average, 10 seconds maximum
- **Components:**
  - Geocoding: <500ms
  - Weather API: <500ms
  - POI API: <1000ms
  - LLM call: <3000ms
  - Processing: <500ms
- **Priority:** High

**NFR-1.2: Concurrent Users**
- **Requirement:** System shall support multiple concurrent users
- **Target:** 10 simultaneous requests without degradation
- **Measurement:** Response time under load
- **Acceptable:** <15% performance degradation at peak
- **Priority:** Medium

**NFR-1.3: API Rate Limits**
- **Requirement:** System shall respect external API limits
- **Limits:**
  - OpenStreetMap: 1 request/second
  - Groq: 14,400 requests/day (free tier)
  - Others: No enforced limits
- **Handling:** Queue requests, display wait message if needed
- **Priority:** High

**NFR-1.4: Client Performance**
- **Requirement:** Frontend shall load and be interactive quickly
- **Targets:**
  - Initial page load: <3 seconds
  - Time to interactive: <5 seconds
  - DOM updates: <100ms
- **Measurement:** Chrome DevTools Lighthouse score >90
- **Priority:** Medium

**NFR-1.5: Memory Usage**
- **Requirement:** System shall use memory efficiently
- **Targets:**
  - Backend: <200 MB per process
  - Frontend: <100 MB per tab
- **Measurement:** System monitoring tools
- **Priority:** Low

**NFR-1.6: PDF Generation**
- **Requirement:** PDF shall generate quickly client-side
- **Target:** <1 second for 8-day itinerary
- **Measurement:** Performance.now() timing
- **Priority:** Low

### 5.2 Safety Requirements

**NFR-2.1: Data Loss Prevention**
- **Requirement:** System shall not lose user input on errors
- **Implementation:** Preserve form data on validation failures
- **Testing:** Simulate errors, verify data retention
- **Priority:** Medium

**NFR-2.2: Graceful Degradation**
- **Requirement:** System shall degrade gracefully on partial failures
- **Scenarios:**
  - If weather API fails: continue without detailed weather
  - If POI API fails: generate generic activities
  - Always inform user of limitations
- **Priority:** Medium

**NFR-2.3: No Destructive Actions**
- **Requirement:** System shall have no destructive user actions
- **Implementation:** All actions are read-only or generative
- **Note:** No delete, modify, or permanent storage actions
- **Priority:** Low

### 5.3 Security Requirements

**NFR-3.1: API Key Protection**
- **Requirement:** API keys shall never be exposed to client
- **Implementation:**
  - Store keys in .env file (server-side only)
  - Use environment variables
  - Never include in client-side code
  - Add .env to .gitignore
- **Priority:** High

**NFR-3.2: Input Sanitization**
- **Requirement:** All user input shall be sanitized
- **Implementation:**
  - Pydantic validation on backend
  - JavaScript validation on frontend
  - Escape HTML in displayed content
  - No eval() or innerHTML with user data
- **Priority:** High

**NFR-3.3: CORS Configuration**
- **Requirement:** CORS shall be properly configured
- **Implementation:**
  - Whitelist specific origins (production)
  - Allow all origins (development only)
  - No credentials allowed
- **Priority:** High

**NFR-3.4: HTTPS Enforcement**
- **Requirement:** Production shall use HTTPS
- **Implementation:**
  - TLS 1.2 or higher
  - Valid SSL certificate
  - Redirect HTTP to HTTPS
- **Priority:** High (production)

**NFR-3.5: No Sensitive Data Storage**
- **Requirement:** System shall not store personal data
- **Implementation:**
  - Stateless architecture
  - No databases
  - No cookies or local storage
  - No logging of personal information
- **Priority:** High

**NFR-3.6: Error Message Security**
- **Requirement:** Error messages shall not expose system internals
- **Implementation:**
  - Generic user-facing messages
  - Detailed logs server-side only
  - No stack traces to client
- **Priority:** Medium

### 5.4 Software Quality Attributes

**NFR-4.1: Reliability**
- **Requirement:** System shall have high success rate
- **Target:** 99% successful itinerary generation
- **Measurement:**
  - Track success/failure ratio
  - Monitor external API uptime
- **Failure Handling:**
  - Retry logic for transient failures
  - Self-healing JSON parsing
  - Fallback error messages
- **Priority:** High

**NFR-4.2: Maintainability**
- **Requirement:** Code shall be maintainable
- **Standards:**
  - PEP 8 for Python code
  - Clear function documentation
  - Modular architecture
  - Separation of concerns
- **Measurement:**
  - Code complexity metrics
  - Documentation coverage
- **Priority:** High

**NFR-4.3: Usability**
- **Requirement:** System shall be easy to use
- **Standards:**
  - Clear, professional UI
  - Intuitive form layout
  - Helpful error messages
  - No technical jargon
- **Testing:** User feedback sessions
- **Priority:** High

**NFR-4.4: Portability**
- **Requirement:** System shall run on multiple platforms
- **Targets:**
  - Server: Linux, Windows, macOS
  - Client: All modern browsers
- **Dependencies:** Cross-platform libraries only
- **Priority:** Medium

**NFR-4.5: Scalability**
- **Requirement:** System shall be scalable (future)
- **Architecture:**
  - Stateless design
  - Horizontal scaling ready
  - No shared state between requests
- **Note:** Current version: single-server deployment
- **Priority:** Low (future consideration)

**NFR-4.6: Testability**
- **Requirement:** Code shall be testable
- **Implementation:**
  - Pure functions where possible
  - Dependency injection
  - Mockable external APIs
  - Unit test coverage
- **Priority:** Medium

**NFR-4.7: Accessibility**
- **Requirement:** UI shall follow basic accessibility guidelines
- **Standards:**
  - Keyboard navigation supported
  - Semantic HTML elements
  - ARIA labels where needed
  - Sufficient color contrast (WCAG AA)
- **Testing:** Screen reader compatibility
- **Priority:** Medium

### 5.5 Business Rules

**BR-1: Budget Allocation**
- **Rule:** Daily activities shall stay within daily budget
- **Formula:** daily_budget = total_budget / duration
- **Enforcement:** LLM instruction, backend validation
- **Exception:** Allow minor overruns (<10%) with note

**BR-2: Activity Timing**
- **Rule:** Each day shall have morning, afternoon, evening activities
- **Exception:** Relaxed pace may have 2 activities (combine slots)
- **Enforcement:** LLM prompt specification

**BR-3: Interest Relevance**
- **Rule:** Activities shall match user interests
- **Default:** If no interests selected, use ["culture", "local_life"]
- **Enforcement:** POI filtering, LLM instruction

**BR-4: Weather Appropriateness**
- **Rule:** Outdoor activities avoided on rainy days
- **Definition:** Rain day = precipitation > 2mm
- **Enforcement:** LLM considers weather in prompt

**BR-5: Free External APIs**
- **Rule:** Only free-tier APIs shall be used
- **Rationale:** Cost control, accessibility
- **Exceptions:** None currently

**BR-6: No Emoji Policy**
- **Rule:** UI shall contain zero emoji characters
- **Rationale:** Professional appearance (user requirement)
- **Enforcement:** Code review, text content audit

**BR-7: Fast Mode Only**
- **Rule:** System shall use fast mode (1 LLM call)
- **Rationale:** Performance, cost efficiency
- **Removed:** Agent mode (5-8 LLM calls)

---

## 6. Other Requirements

### Legal Requirements

**L-1: API Terms of Service**
- **Requirement:** Must comply with all external API ToS
- **Specific Terms:**
  - OpenStreetMap: Attribution required, respect usage limits
  - Open-Meteo: No registration required, fair use
  - Overpass: Fair use policy, no abusive queries
  - Groq: Free tier limits, no reselling

**L-2: Content Liability**
- **Disclaimer:** System provides suggestions only, not guarantees
- **User Responsibility:** Users responsible for verifying information
- **Implementation:** Display disclaimer on itinerary

**L-3: Data Protection**
- **Compliance:** No GDPR concerns (no data stored)
- **User Privacy:** No tracking, no cookies, no analytics

### Internationalization Requirements

**I-1: Language**
- **Current:** English only
- **Future:** Multi-language support (out of scope v2.0)

**I-2: Currency**
- **Current:** USD only
- **Future:** Multi-currency support (out of scope v2.0)

**I-3: Date Format**
- **Current:** ISO 8601 (YYYY-MM-DD)
- **Display:** Can be localized client-side (future)

### Environmental Requirements

**E-1: Browser Support**
- **Minimum:** Chrome 90, Firefox 88, Edge 90, Safari 14
- **JavaScript:** ES6+ features required
- **CSS:** CSS3 with variables, grid, flexbox

**E-2: Server Environment**
- **OS:** Linux preferred (Ubuntu 20.04+)
- **Python:** 3.11 or higher
- **Memory:** Minimum 4 GB RAM
- **Storage:** 10 GB for application and logs

---

## Appendix A: Glossary

**AI (Artificial Intelligence):** Computer systems that perform tasks requiring human intelligence

**API (Application Programming Interface):** Interface for software components to communicate

**CORS (Cross-Origin Resource Sharing):** Security mechanism for web browser requests

**FastAPI:** Modern Python web framework for building APIs

**Geocoding:** Converting location names to geographic coordinates

**JSON (JavaScript Object Notation):** Lightweight data interchange format

**LLM (Large Language Model):** AI model trained on text data for language tasks

**PDF (Portable Document Format):** File format for document presentation

**POI (Point of Interest):** Specific location that may be useful or interesting

**Pydantic:** Python library for data validation using type annotations

**REST (Representational State Transfer):** Architectural style for web services

**SPA (Single Page Application):** Web app that dynamically updates single page

**SRS (Software Requirements Specification):** Document describing system requirements

**TLS (Transport Layer Security):** Cryptographic protocol for secure communication

**UI (User Interface):** Visual elements users interact with

**UX (User Experience):** Overall experience users have with system

**Itinerary:** Detailed plan for a trip including dates, activities, locations

**Trip Planning:** Process of organizing travel activities and schedule

**Fast Mode:** System operation mode using single AI call (5-10s response)

**Agent Mode:** Deprecated operation mode using multiple AI calls (50-80s response)

---

## Appendix B: Analysis Models

### Use Case Diagram

```
User
  |
  |---(Plan Trip)
  |     |
  |     |---(includes)---[Validate Input]
  |     |
  |     |---(includes)---[Generate Itinerary]
  |     |
  |     |---(includes)---[Display Results]
  |
  |---(Download PDF)
  |
  |---(Retry on Error)
```

### State Diagram

```
[Initial State] 
    ↓
[Input Form]
    ↓ (Submit)
[Validating]
    ↓ (Valid)        ↓ (Invalid)
[Loading]        [Show Error]
    ↓                    ↓
[Processing]      [Input Form]
    ↓ (Success)   ↓ (Failure)
[Results]        [Error Display]
    ↓                    ↓
[PDF Download]   [Retry] → [Input Form]
    ↓
[Final State]
```

### Data Flow Diagram (Level 0)

```
User → [Input] → System → [Itinerary] → User
                    ↕
         External APIs (OSM, Weather, POI, LLM)
```

### Entity Relationship Diagram

```
TripRequest (1) ----generates---→ (1) TripResponse
                                        |
                                        |--contains--(1) TripOverview
                                        |
                                        |--contains--(1..*) DayItinerary
                                        |                   |
                                        |                   |--has--(3) Activity
                                        |
                                        |--contains--(1) SmartAdditions
```

---

## Appendix C: To Be Determined List

**TBD-1: Authentication System**
- **Status:** Out of scope for v2.0
- **Consideration:** User accounts for saving itineraries
- **Timeline:** Future version

**TBD-2: Multi-Destination Support**
- **Status:** Out of scope for v2.0
- **Consideration:** Plan trips across multiple cities
- **Timeline:** Future version

**TBD-3: Booking Integration**
- **Status:** Out of scope for v2.0
- **Consideration:** Direct hotel/flight booking links
- **Timeline:** Future version

**TBD-4: Social Features**
- **Status:** Out of scope for v2.0
- **Consideration:** Share itineraries, collaborative planning
- **Timeline:** Future version

**TBD-5: Mobile Native App**
- **Status:** Out of scope for v2.0
- **Consideration:** iOS and Android applications
- **Timeline:** Future version

**TBD-6: Itinerary Editing**
- **Status:** Out of scope for v2.0
- **Consideration:** Allow users to modify generated itineraries
- **Timeline:** Future version

**TBD-7: Cost Optimization**
- **Status:** Under consideration
- **Consideration:** Implement caching for repeat destinations
- **Decision:** Pending usage metrics

**TBD-8: Load Balancing**
- **Status:** Not needed currently
- **Consideration:** Deploy multiple server instances
- **Trigger:** When concurrent users exceed 20

---

## Document Approval

**Version:** 1.0  
**Date:** February 21, 2026  
**Status:** Final

**Prepared By:** Development Team  
**Reviewed By:** [Stakeholder Name]  
**Approved By:** [Project Manager Name]  

**Change History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-21 | Dev Team | Initial SRS document |

---

**End of Software Requirements Specification**
