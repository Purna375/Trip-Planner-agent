# PlantUML Diagrams Directory

This directory contains all PlantUML diagram source files for the AI Trip Planner Design Document.

## 📁 Directory Contents

| File | Description | Referenced In |
|------|-------------|---------------|
| `system-context-diagram.puml` | System context with external actors | Design Doc §2.1 |
| `high-level-architecture-diagram.puml` | Three-tier architecture | Design Doc §2.2 |
| `component-architecture-diagram.puml` | Detailed component view | Design Doc §3.2 |
| `data-flow-diagram.puml` | Complete data flow | Design Doc §3.3 |
| `deployment-architecture-diagram.puml` | Deployment topology | Design Doc §3.4, §10 |
| `security-architecture-diagram.puml` | Security layers | Design Doc §8 |
| `ui-wireframe.puml` | User interface layout | Design Doc §6.1 |
| `er-diagram-future.puml` | Future database schema | Design Doc §4.5 |

## 🎨 How to Render Diagrams

### Option 1: Online (Easiest)

1. Open any `.puml` file in this directory
2. Copy the entire content
3. Go to http://www.plantuml.com/plantuml/uml/
4. Paste the code
5. View and download the rendered diagram (PNG, SVG, PDF)

### Option 2: VS Code Extension

1. Install the "PlantUML" extension by jebbs
2. Open any `.puml` file
3. Press `Alt+D` (Windows/Linux) or `Option+D` (Mac) to preview
4. Right-click the preview to export as image

**VS Code Extension Features:**
- Live preview
- Export to PNG, SVG, PDF
- Auto-completion
- Syntax highlighting

### Option 3: Command Line

```bash
# Prerequisites: Java installed
# Download plantuml.jar from https://plantuml.com/download

# Render single diagram
java -jar plantuml.jar system-context-diagram.puml

# Render all diagrams
java -jar plantuml.jar *.puml

# Specify output format
java -jar plantuml.jar -tsvg system-context-diagram.puml  # SVG
java -jar plantuml.jar -tpng system-context-diagram.puml  # PNG
java -jar plantuml.jar -tpdf system-context-diagram.puml  # PDF
```

### Option 4: Docker

```bash
# Run PlantUML server
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty

# Access at http://localhost:8080
# Upload .puml files through the web interface
```

### Option 5: GitHub Integration

GitHub automatically renders PlantUML diagrams in markdown:

```markdown
![Diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/username/repo/main/diagrams/system-context-diagram.puml)
```

## 📋 Diagram Descriptions

### 1. System Context Diagram
**Purpose:** High-level view of the system and its external interactions
**Shows:**
- User actor
- AI Trip Planner system
- External APIs (Groq, OpenStreetMap, Open-Meteo, Overpass, OpenRouteService)
- Data flows between components

**Use Case:** Explaining the system to stakeholders and non-technical audiences

---

### 2. High-Level Architecture Diagram
**Purpose:** Three-tier architecture overview
**Shows:**
- Presentation Layer (Frontend: HTML/CSS/JS)
- Application Layer (Backend: FastAPI, LangChain, Services)
- Data Layer (External APIs)
- Communication patterns

**Use Case:** Technical overview for developers and architects

---

### 3. Component Architecture Diagram
**Purpose:** Detailed component view with all modules
**Shows:**
- Frontend files (index.html, styles.css, app.js, api.js)
- Backend structure (main.py, routes, services, agents, models, utils)
- External API integrations
- Component dependencies

**Use Case:** Understanding codebase structure and dependencies

---

### 4. Data Flow Diagram
**Purpose:** Complete request/response flow
**Shows:**
- User input submission
- Request validation
- External API calls (geocoding, weather, POI, routing)
- AI agent processing
- Response generation
- Error handling paths

**Use Case:** Debugging, optimization, and understanding system behavior

---

### 5. Deployment Architecture Diagram
**Purpose:** Production deployment topology
**Shows:**
- Client browsers
- Load balancers
- Application servers with Docker containers
- Environment variable management
- External service connections
- Monitoring and logging

**Use Case:** DevOps, infrastructure planning, scaling strategies

---

### 6. Security Architecture Diagram
**Purpose:** Comprehensive security layers
**Shows:**
- Client security (HTTPS, CSP, XSS prevention)
- Network security (TLS, CORS, rate limiting)
- Application security (validation, encoding, authentication)
- Data security (secrets management, encryption)
- Infrastructure security (containers, cloud)
- Monitoring and incident response

**Use Case:** Security audits, compliance, threat modeling

---

### 7. UI Wireframe
**Purpose:** User interface layout
**Shows:**
- Header section
- Input form with all fields
- Loading state with progress
- Results display (overview, itineraries, recommendations)
- Error handling UI
- Footer

**Use Case:** Frontend development, UX design, stakeholder demos

---

### 8. Entity-Relationship Diagram (Future)
**Purpose:** Database schema for future enhancements
**Shows:**
- User management tables
- Trip and itinerary storage
- Activity details
- Favorites and feedback
- API caching
- User preferences

**Status:** Not implemented in v1.0 (stateless design)
**Use Case:** Planning future features with persistent storage

---

## 🔄 Updating Diagrams

When modifying diagrams:

1. Edit the `.puml` source file
2. Render to verify changes
3. Update the corresponding image in the Design Document
4. Commit both the source `.puml` and rendered image
5. Update the DIAGRAMS-APPENDIX.md if needed

## 📐 Diagram Conventions

All diagrams follow these conventions:

**Colors:**
- **Light Blue:** Core system components
- **Light Green:** Frontend/client components
- **Light Yellow:** External services
- **Light Gray:** Infrastructure/configuration
- **Light Coral:** Error states

**Arrows:**
- **Solid Lines:** Direct dependencies/calls
- **Dashed Lines:** Indirect relationships
- **Bold Arrows:** Main data flow

**Notes:**
- All diagrams include explanatory notes
- Technical details in right/bottom annotations
- Context provided for complex flows

## 🛠️ Customization

To customize diagrams for your needs:

1. **Change Colors:**
   ```plantuml
   skinparam rectangle {
       BackgroundColor YourColor
       BorderColor YourBorderColor
   }
   ```

2. **Adjust Layout:**
   ```plantuml
   left to right direction  ' Horizontal layout
   top to bottom direction  ' Vertical layout (default)
   ```

3. **Export Settings:**
   ```bash
   # High-resolution PNG
   java -jar plantuml.jar -DPLANTUML_LIMIT_SIZE=8192 diagram.puml
   
   # With specific DPI
   java -jar plantuml.jar -Xmx1024m diagram.puml
   ```

## 📚 Additional Resources

- **PlantUML Official Site:** https://plantuml.com/
- **Language Reference:** https://plantuml.com/guide
- **Component Diagrams:** https://plantuml.com/component-diagram
- **Sequence Diagrams:** https://plantuml.com/sequence-diagram
- **Deployment Diagrams:** https://plantuml.com/deployment-diagram
- **Activity Diagrams:** https://plantuml.com/activity-diagram-beta
- **ER Diagrams:** https://plantuml.com/ie-diagram

## ❓ Troubleshooting

### Issue: "Cannot generate diagram"
**Solution:** Check PlantUML syntax. Common issues:
- Missing `@startuml` or `@enduml`
- Unmatched quotes
- Invalid relationship syntax

### Issue: "OutOfMemoryError"
**Solution:** Increase Java heap size:
```bash
java -Xmx1024m -jar plantuml.jar diagram.puml
```

### Issue: "Diagram too large"
**Solution:** Split into smaller diagrams or increase size limit:
```bash
java -DPLANTUML_LIMIT_SIZE=8192 -jar plantuml.jar diagram.puml
```

### Issue: "Cannot find class"
**Solution:** Update PlantUML to latest version:
```bash
# Download latest plantuml.jar
wget http://sourceforge.net/projects/plantuml/files/plantuml.jar/download
```

## 📄 License

These diagrams are part of the AI Trip Planner project documentation.

---

**Directory Version:** 1.0
**Last Updated:** 2026-02-25
**Maintained By:** Development Team
