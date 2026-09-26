# BizMind – Database Architecture & Entity Relationship Design

## Overview
The BizMind database architecture uses MySQL 8.0+ designed in 3NF (Third Normal Form) with explicit foreign key constraints, indexing for spatial coordinates & user lookup, and JSON column support for machine learning features and spatial aggregations.

## Relational Entity Map
1. **users** (1) ──< (N) **businesses**
2. **business_categories** (1) ──< (N) **businesses**
3. **locations** (1) ──< (N) **businesses**
4. **business_categories** (1) ──< (N) **competitors**
5. **locations** (1) ──< (N) **competitors**
6. **business_categories** (1) ──< (N) **market_data**
7. **locations** (1) ──< (N) **market_data**
8. **businesses** (1) ──< (N) **business_plans**
9. **business_plans** (1) ── (1) **financial_projections**
10. **business_plans** (1) ──< (N) **predictions**
11. **predictions** (1) ──< (N) **recommendations**
12. **users** (1) ──< (N) **saved_businesses** (N) >── (0..1) **businesses**
13. **users** (1) ──< (N) **reviews** (N) >── (1) **businesses**
14. **users** (1) ──< (N) **notifications**
15. **users** (1) ──< (N) **admin_logs**
16. **users** (1) ──< (N) **location_analyses**
17. **users** (1) ──< (N) **market_analyses** (1) ──< (N) **market_competitors**
18. **location_analyses** (1) ──< (0..N) **market_analyses**
19. **business_plans** (1) ──< (0..N) **market_analyses**

## Key Constraint Rules
- **Referential Integrity**: Cascading deletions apply to user-owned draft plans, predictions, market analyses, and notifications.
- **Data Protection**: Business categories and location definitions are protected (`RESTRICT` on delete) to preserve historical analytical continuity.
- **Composite Uniqueness**:
  - `uk_market_cat_loc` enforces one canonical market profile per category-location pair.
  - `uk_user_osm` enforces one bookmark per user per OSM entity.
  - `uk_fin_plan` enforces a strict 1-to-1 relationship between a business plan and its financial feasibility model.
