# BizMind – Database Design & Schema Specification

## Database Engine: MySQL 8.0+ / InnoDB

### Core Entity Summary
1. `users`: Stores user identity, hashed credentials, and role tiers (`USER`, `ADMIN`).
2. `business_categories`: Industry taxonomies with benchmark capital and margin parameters.
3. `locations`: Geographic coordinates, population metrics, tier classification, and rental cost benchmarks.
4. `businesses`: User-configured business ventures tied to categories and locations.
5. `market_data`: Statistical market metrics for category-location pairs (demand index, saturation).
6. `competitors`: Geographic points of competitor presence, rating, and market share.
7. `business_plans`: Core planning metadata, capital allocations, and operational timelines.
8. `financial_projections`: Fixed/variable cost modeling, projected revenue, break-even timelines.
9. `predictions`: ML inference outputs, probability percentages, confidence ratings, and JSON snapshots.
10. `recommendations`: Actionable intelligence generated from ML outputs.
11. `saved_businesses`: Bookmarked venues, competitors, and points of interest from live maps/Places.
12. `reviews`: User-submitted ratings and qualitative feedback.
13. `notifications`: Real-time and persistent alerting for analysis results.
14. `admin_logs`: System audit trail for compliance and monitoring.
15. `location_analyses`: Saved location intelligence reports, business density, and opportunity scoring.
16. `market_analyses`: Hyperlocal market intelligence, competitor density, and trade gap analyses.
17. `market_competitors`: Stored competitor details associated with hyperlocal market analyses.
