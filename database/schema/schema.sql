-- ==============================================================================
-- BIZMIND - DATABASE SCHEMA DEFINITION (MySQL 8.0+)
-- AI Business Planning, Market Analysis & Success Prediction Platform
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `profile_image` VARCHAR(500) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BUSINESS CATEGORIES
CREATE TABLE IF NOT EXISTS `business_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `risk_level` ENUM('low', 'moderate', 'high', 'very_high') NOT NULL DEFAULT 'moderate',
  `avg_initial_investment` DECIMAL(14,2) DEFAULT NULL,
  `avg_margin_percentage` DECIMAL(5,2) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS `locations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `area_tier` ENUM('tier_1', 'tier_2', 'tier_3', 'rural') NOT NULL DEFAULT 'tier_1',
  `population_density_sq_km` INT UNSIGNED DEFAULT NULL,
  `commercial_footfall_score` DECIMAL(4, 2) DEFAULT NULL COMMENT 'Index 0.00 to 10.00',
  `avg_rental_sqft` DECIMAL(10, 2) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_locations_coords` (`latitude`, `longitude`),
  KEY `idx_locations_city` (`city`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BUSINESS ENTITIES
CREATE TABLE IF NOT EXISTS `businesses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `location_id` BIGINT UNSIGNED NOT NULL,
  `business_name` VARCHAR(200) NOT NULL,
  `target_demographic` VARCHAR(255) DEFAULT NULL,
  `operational_stage` ENUM('idea', 'planning', 'ready_to_launch', 'operating') NOT NULL DEFAULT 'idea',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_businesses_user` (`user_id`),
  KEY `fk_businesses_category` (`category_id`),
  KEY `fk_businesses_location` (`location_id`),
  CONSTRAINT `fk_businesses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_businesses_category` FOREIGN KEY (`category_id`) REFERENCES `business_categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_businesses_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. MARKET DATA
CREATE TABLE IF NOT EXISTS `market_data` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `location_id` BIGINT UNSIGNED NOT NULL,
  `market_size_estimate` DECIMAL(16,2) DEFAULT NULL,
  `annual_growth_rate` DECIMAL(5,2) DEFAULT NULL,
  `saturation_index` DECIMAL(4,2) DEFAULT NULL COMMENT 'Index 0.00 to 10.00',
  `average_ticket_size` DECIMAL(10,2) DEFAULT NULL,
  `demand_score` DECIMAL(4,2) DEFAULT NULL COMMENT 'Index 0.00 to 10.00',
  `last_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_market_cat_loc` (`category_id`, `location_id`),
  CONSTRAINT `fk_market_category` FOREIGN KEY (`category_id`) REFERENCES `business_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_market_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COMPETITORS
CREATE TABLE IF NOT EXISTS `competitors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `location_id` BIGINT UNSIGNED NOT NULL,
  `competitor_name` VARCHAR(200) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `estimated_market_share` DECIMAL(5,2) DEFAULT NULL,
  `customer_rating` DECIMAL(3,2) DEFAULT NULL,
  `price_tier` ENUM('budget', 'mid_range', 'premium', 'luxury') DEFAULT 'mid_range',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_competitors_cat` (`category_id`),
  KEY `fk_competitors_loc` (`location_id`),
  CONSTRAINT `fk_competitors_cat` FOREIGN KEY (`category_id`) REFERENCES `business_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_competitors_loc` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BUSINESS PLANS
CREATE TABLE IF NOT EXISTS `business_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `business_id` BIGINT UNSIGNED NOT NULL,
  `plan_title` VARCHAR(255) NOT NULL,
  `executive_summary` TEXT DEFAULT NULL,
  `initial_capital` DECIMAL(14,2) NOT NULL,
  `planned_timeline_months` INT UNSIGNED NOT NULL DEFAULT 12,
  `plan_status` ENUM('draft', 'analyzed', 'archived') NOT NULL DEFAULT 'draft',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_plans_user` (`user_id`),
  KEY `fk_plans_biz` (`business_id`),
  CONSTRAINT `fk_plans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_plans_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. FINANCIAL PROJECTIONS
CREATE TABLE IF NOT EXISTS `financial_projections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_id` BIGINT UNSIGNED NOT NULL,
  `monthly_fixed_costs` DECIMAL(14,2) NOT NULL,
  `variable_cost_percentage` DECIMAL(5,2) NOT NULL,
  `projected_monthly_revenue` DECIMAL(14,2) NOT NULL,
  `break_even_period_months` INT UNSIGNED DEFAULT NULL,
  `projected_roi_1yr` DECIMAL(6,2) DEFAULT NULL,
  `projected_roi_3yr` DECIMAL(6,2) DEFAULT NULL,
  `cashflow_runway_months` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_fin_plan` (`plan_id`),
  CONSTRAINT `fk_fin_plan` FOREIGN KEY (`plan_id`) REFERENCES `business_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PREDICTIONS (ML OUTPUTS)
CREATE TABLE IF NOT EXISTS `predictions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `plan_id` BIGINT UNSIGNED NOT NULL,
  `success_probability` DECIMAL(5,2) NOT NULL COMMENT 'Percentage 0.00 to 100.00',
  `confidence_score` DECIMAL(5,2) NOT NULL COMMENT 'Percentage 0.00 to 100.00',
  `risk_tier` ENUM('low', 'moderate', 'high', 'critical') NOT NULL,
  `model_version` VARCHAR(50) NOT NULL,
  `features_snapshot_json` JSON NOT NULL,
  `risk_factors_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pred_user` (`user_id`),
  KEY `fk_pred_plan` (`plan_id`),
  CONSTRAINT `fk_pred_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pred_plan` FOREIGN KEY (`plan_id`) REFERENCES `business_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `prediction_id` BIGINT UNSIGNED NOT NULL,
  `recommendation_type` ENUM('location', 'pricing', 'marketing', 'risk_mitigation', 'capital') NOT NULL,
  `action_title` VARCHAR(255) NOT NULL,
  `detailed_advice` TEXT NOT NULL,
  `priority_level` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rec_prediction` (`prediction_id`),
  CONSTRAINT `fk_rec_prediction` FOREIGN KEY (`prediction_id`) REFERENCES `predictions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. SAVED BUSINESSES
CREATE TABLE IF NOT EXISTS `saved_businesses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `business_id` BIGINT UNSIGNED NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_saved_biz` (`user_id`, `business_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. REVIEWS & FEEDBACK
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `business_id` BIGINT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `review_text` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rev_user` (`user_id`),
  KEY `fk_rev_biz` (`business_id`),
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `notification_type` ENUM('prediction_ready', 'market_alert', 'system', 'plan_update') NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notif_user` (`user_id`),
  KEY `idx_notif_read` (`user_id`, `is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user_id` BIGINT UNSIGNED NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` BIGINT UNSIGNED DEFAULT NULL,
  `details_json` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_admin_log_user` (`admin_user_id`),
  CONSTRAINT `fk_admin_log_user` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
