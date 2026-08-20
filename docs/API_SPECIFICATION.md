# BizMind – REST API Specification Catalog

All responses follow the unified JSON structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-08-20T09:45:00.000Z"
}
```

## Route Catalog
| Group | Endpoint | Method | Description |
|---|---|---|---|
| Health | `/api/health` | GET | System and subsystems operational health status |
| Auth | `/api/auth/login` | POST | Authenticate user & issue JWT token |
| Auth | `/api/auth/register` | POST | Register a new user account |
| Auth | `/api/auth/me` | GET | Retrieve authenticated profile |
| Businesses | `/api/businesses` | GET | List user businesses |
| Businesses | `/api/businesses/categories`| GET | List industry categories |
| Market | `/api/market/trends` | GET | Retrieve market growth & saturation trends |
| Locations | `/api/locations/info` | GET | Query coordinates & spatial density |
| Plans | `/api/plans` | POST | Submit structured business plan |
| Predictions | `/api/predictions/predict` | POST | Trigger ML success prediction model |
| Reports | `/api/reports/generate` | POST | Generate business feasibility dossier |
| Admin | `/api/admin/stats` | GET | System performance & aggregate analytics |
