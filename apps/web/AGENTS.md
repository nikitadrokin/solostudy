# Canvas Study Portal - Product Context

> A document to provide context for AI assistants and developers working on the SoloStudy Canvas integration.

## Vision Overview

The goal is to create a **study portal** that wraps Canvas LMS features in a superior user experience. Rather than simply mirroring Canvas's dashboard, we aim to:

1. **Transform data into insights** — Canvas shows your data, we transform it into actionable study guidance
2. **Provide value without AI/LLMs** — Use pure computation, algorithms, and smart data processing to deliver features that feel intelligent
3. **Create a premium UI experience** — Modern, polished interface that makes students actually want to use it

---

## Core Philosophy: Non-AI Value Creation

The key differentiator is providing "smart" features **without relying on LLMs**. Here's how we achieve this:

### Algorithmic Intelligence
- **Grade calculations** — Weighted averages, projections, what-if scenarios
- **Priority scoring** — Assignment urgency based on due dates, weights, and impact
- **Statistical analysis** — Trends, averages, and pattern recognition in grades
- **Time-based sorting** — Smart ordering of assignments by optimal study sequence

### Data Synthesis
- Combining multiple Canvas endpoints to create unified views
- Cross-referencing courses, assignments, grades, and calendar events
- Aggregating scattered information into actionable dashboards

### Computation-Driven Features
- Calculating minimum scores needed for target grades
- Identifying high-impact assignments worth focusing on
- Tracking grade trajectory over time
- Generating study schedules based on deadline proximity and assignment weight

---

## Current Implementation Status

### Existing Features

#### ✅ Grade Predictor (Available)
- Location: `src/app/canvas/grade-predictor/page.tsx`
- Calculates current weighted grade across assignment groups
- Projects what's needed on remaining work for target grades (A, B, C, D)
- Shows breakdown by assignment category with weights
- Expandable assignment details per group

#### 📁 Study Lab Hub
- Location: `src/app/canvas/study-lab/page.tsx`
- Landing page showcasing upcoming experimental features
- Feature cards with status badges (Available, In Development, Coming Soon)

### Canvas API Integration

The following Canvas API endpoints are already integrated:

| Endpoint | Function | Data Retrieved |
|----------|----------|----------------|
| `/users/self` | `fetchCanvasUser` | User profile info |
| `/courses` | `fetchCanvasCourses` | All enrolled courses |
| `/courses/:id/assignments` | `fetchCourseAssignments` | Assignments per course |
| `/courses/:id/assignment_groups` | `fetchAssignmentGroups` | Categories with weights |
| `/courses/:id/assignments?include[]=submission` | `fetchAssignmentsWithSubmissions` | Assignments with grades |
| `/courses/:id/enrollments` | `fetchUserEnrollment` | Grade data |
| `/calendar_events` | `fetchCalendarEvents` | Calendar events |
| `/announcements` | `fetchAnnouncements` | Course announcements |

---

## Planned Features (Non-AI)

### 1. Intelligent Study Planner
**Status:** Coming Soon

**Concept:** Generate optimized study schedules without AI by using:
- Due date proximity weighting
- Assignment point value / course weight analysis
- Historical time-to-complete patterns (if trackable)
- Buffer time calculations for high-stakes assignments

**Data needed:**
- Assignment due dates
- Assignment weights
- Course weights in overall GPA

---

### 2. Assignment Impact Analyzer
**Status:** Not Started

**Concept:** Show which assignments have the highest impact on your final grade.

**Algorithm:**
```
impact_score = (assignment_points / total_group_points) × group_weight
```

**UI Ideas:**
- Ranked list of "Most Important Assignments"
- Visual indicator of impact (high/medium/low)
- Filter by course or date range

---

### 3. Grade Trajectory Tracker
**Status:** Not Started

**Concept:** Track how your grade has changed over time (requires storing historical snapshots).

**Implementation:**
- Store grade snapshots on each app visit
- Plot grade changes over time per course
- Show trend (improving, declining, stable)

---

### 4. Deadline Heatmap
**Status:** Not Started

**Concept:** Visual calendar showing assignment density and urgency.

**Features:**
- Color-coded by urgency/weight
- Week-at-a-glance view
- "Crunch time" warnings for heavy deadline clusters

---

### 5. Discussion Insights (Non-AI Version)
**Status:** Coming Soon (AI version planned)

**Non-AI Approach:**
- Word frequency analysis
- Question detection (sentences ending with ?)
- Your participation stats (post count, reply count)
- Threading summary (depth of conversations)

---

## Features That May Use AI (Future)

These features are planned but would require LLM integration:

| Feature | Why AI is Needed |
|---------|------------------|
| AI Study Guide Generator | Synthesizing course content into summaries |
| AI Quiz Practice Mode | Generating practice questions |
| Discussion Thread Summaries | Natural language summarization |
| Smart Content Extraction | Parsing unstructured page content |

> **Note:** Even AI features should have graceful non-AI fallbacks where possible.

---

## UI/UX Principles

### Design Goals
1. **Premium aesthetic** — Glassmorphism, subtle gradients, smooth animations
2. **Clarity over density** — Don't overwhelm with data, prioritize insights
3. **Progressive disclosure** — Summary first, details on demand
4. **Mobile-friendly** — Responsive design for on-the-go checking

### Component Patterns
- Use existing shadcn/ui components (`Card`, `Badge`, `Empty`, `Item`)
- Framer Motion for animations
- Consistent gradient accents per feature area
- Status badges for feature availability

---

## Technical Architecture

### Stack
- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, CSS variables for theming
- **State:** TanStack Query for server state
- **API:** tRPC for type-safe API calls
- **Animation:** Framer Motion

### Key Files
```
src/
├── app/canvas/
│   ├── grade-predictor/page.tsx    # Grade prediction feature
│   ├── study-lab/page.tsx          # Feature showcase hub
│   ├── courses/page.tsx            # Course list
│   ├── assignments/page.tsx        # Assignment list
│   ├── grades/page.tsx             # Grade overview
│   ├── calendar/page.tsx           # Calendar view
│   └── announcements/page.tsx      # Announcements
├── lib/canvas.ts                   # Canvas API utilities
├── routers/canvas.ts               # tRPC router for Canvas
└── types/canvas.d.ts               # TypeScript types
```

---

## Development Guidelines

### Adding New Features

1. **Define the algorithm** — Document how the feature works without AI
2. **Identify data needs** — What Canvas endpoints are required?
3. **Create backend procedure** — Add to `routers/canvas.ts`
4. **Build UI** — Create page in `app/canvas/[feature]/`
5. **Update Study Lab** — Add feature card to hub page

### API Considerations
- Canvas APIs are paginated — use `fetchPaginatedData` helper
- Handle rate limiting gracefully (429 errors)
- Some data is user-specific (enrollments, submissions)
- Token validation happens per-request

---

## Summary

This study portal aims to be the "better Canvas experience" — not by adding AI, but by:
- **Organizing** scattered data into coherent views
- **Calculating** insights that Canvas doesn't surface
- **Visualizing** academic progress in meaningful ways
- **Prioritizing** what matters most for student success

The value proposition: *"Canvas has your data. We help you understand it."*
