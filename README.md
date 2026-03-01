# Chatbot-Driven Smart Planner System – Backend

## Overview

The backend is the core logic layer of the Smart Planner System.  
It handles:

- Natural language processing via Gemini API
- Constraint extraction
- Confidence evaluation
- Deterministic plan generation
- Schedule building
- Plan regeneration logic
- Session management

The backend is the single source of truth for conversation state and planning logic.

---

## Tech Stack

- Node.js
- Express.js
- Gemini API (Google Generative AI)
- In-memory session store
- Modular utility architecture

---

## Project Structure

Backend/
├── src/
│   ├── config/
│   │   └── env.js                 # Environment variable configuration
│   │
│   ├── controllers/               # Handles HTTP request logic
│   │   ├── chat.controller.js
│   │   ├── plan.controller.js
│   │   └── refine.controller.js
│   │
│   ├── routes/                    # API route definitions
│   │   ├── chat.routes.js
│   │   ├── plan.routes.js
│   │   └── refine.routes.js
│   │
│   ├── services/                  # External integrations & session logic
│   │   ├── chatbot.service.js     # Gemini API integration
│   │   └── session.service.js     # In-memory session management
│   │
│   ├── utils/                     # Core business logic
│   │   ├── activityDataset.js
│   │   ├── confidenceEvaluator.js
│   │   ├── constraintExtractor.js
│   │   ├── planningEngine.js
│   │   └── scheduleBuilder.js
│   │
│   ├── middleware/
│   │   └── error.middleware.js
│   │
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Application entry point
│
├── .env                           # Environment variables
├── list-models.js                 # Gemini model testing script
├── package.json
└── package-lock.json

---

## API Endpoints

### POST /chat

Primary conversational endpoint.

Request:
{
  "sessionId": "abc123",
  "message": "I have 2 hours and ₹200"
}

Response:
{
  "chatReply": "Here’s a plan that fits your preferences.",
  "suggestions": [],
  "plan": {
    "status": "optimized",
    "activities": [...],
    "estimatedCost": 180,
    "timeWindow": "14:00 - 16:00"
  }
}

---

## Core Components

### 1. Constraint Extractor

Extracts structured data from natural language:
- Time (hours, minutes)
- Budget
- Mood
- Distance
- Category
- Generic keywords

---

### 2. Confidence Evaluator

Calculates readiness for planning:

Time → 0.3  
Budget → 0.3  
Mood → 0.2  
Distance → 0.2  

Threshold ≥ 0.8 triggers plan generation.

---

### 3. Planning Engine

- Filters activities by hard constraints
- Applies weighted scoring:
  - Budget Fit (0.35)
  - Duration Fit (0.25)
  - Mood Fit (0.2)
  - Distance Fit (0.1)
  - Category Boost (0.1)
  - Keyword Boost (0.3)
- Avoids previous plan on regeneration
- Returns optimized activity

---

### 4. Schedule Builder

- Calculates start/end times
- Computes total cost
- Calculates distance
- Adds walking activity if distance ≥ 0.20 km

---

### 5. Gemini Integration

Used only for:
- Conversational replies
- Follow-up suggestions

Not used for:
- Plan generation
- Optimization
- Constraint enforcement

---

## Environment Setup

Create a .env file:

GEMINI_API_KEY=your_api_key_here
PORT=5000

---

## Installation

npm install
npm run dev

Server runs on:
http://localhost:5000

---

## Design Principles

- Deterministic planning logic
- Explainable scoring
- Modular architecture
- Clear separation of AI and logic layers
- Easily extensible dataset

---

## Limitations

- Static activity dataset
- No real-time location APIs
- Basic keyword matching
- No persistent storage (in-memory sessions)

---

## Future Enhancements

- Multi-activity sequence optimization
- Real map integration
- Database persistence
- ML-based ranking
- Authentication layer
