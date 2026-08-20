# BizMind – System Architecture & Technical Specifications

## High-Level Architectural Flow
```
┌────────────────────────────────────────────────────────┐
│                   React + Vite + Tailwind               │
│                  Frontend Web Application              │
└────────────────────────────┬───────────────────────────┘
                             │ REST / JSON (Axios)
                             ▼
┌────────────────────────────────────────────────────────┐
│              Node.js / Express Backend Engine          │
│   (Controllers, Routing, JWT Auth, Database Service)   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │ Internal HTTP (FastAPI)
               ▼                          ▼
┌─────────────────────────────┐ ┌────────────────────────┐
│     MySQL 8.0 Database      │ │ Python ML Microservice │
│ (3NF Relational Data Store) │ │ (FastAPI, Scikit-Learn)│
└─────────────────────────────┘ └────────────────────────┘
```

## Spatial Mapping Layer
- **Map Library**: Leaflet 1.9+
- **Tile Provider**: OpenStreetMap Standard & Carto Dark Matter Tiles
- **Zero Cost Dependency**: No paid Google Maps billing or API key requirement.

## Layer Separation Principles
1. **Frontend**: Pure presentational & client-side state management. No business calculations, database credentials, or secret keys.
2. **Backend**: Express REST API acting as the central broker, orchestrator, and security perimeter.
3. **ML Microservice**: Isolated Python FastAPI container performing statistical modeling and classification.
4. **Database**: Relational integrity with foreign key cascading and strict type definitions.
