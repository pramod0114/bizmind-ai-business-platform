/**
 * BizMind – Root Application & Routing Hierarchy
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// User / Entrepreneur Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { BusinessPlannerPage } from './pages/dashboard/BusinessPlannerPage';
import { BusinessPlansPage } from './pages/dashboard/BusinessPlansPage';
import { BusinessPlanDetailPage } from './pages/dashboard/BusinessPlanDetailPage';
import { BusinessPlanFormPage } from './pages/dashboard/BusinessPlanFormPage';
import { FinancialAnalysisPage } from './pages/dashboard/FinancialAnalysisPage';
import { MarketAnalysisPage } from './pages/dashboard/MarketAnalysisPage';
import { LocationAnalysisPage } from './pages/dashboard/LocationAnalysisPage';
import { ComparisonPage } from './pages/dashboard/ComparisonPage';
import { PredictionsPage } from './pages/dashboard/PredictionsPage';
import { RecommendationsPage } from './pages/dashboard/RecommendationsPage';
import { SavedPage } from './pages/dashboard/SavedPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { NotFoundPage } from './pages/dashboard/NotFoundPage';

// Administrator Console Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBusinessesPage } from './pages/admin/AdminBusinessesPage';
import { AdminMarketDataPage } from './pages/admin/AdminMarketDataPage';
import { AdminMLPage } from './pages/admin/AdminMLPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Marketing & Informational Views */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* USER DASHBOARD: Dedicated to Entrepreneurs & Business Planners */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/business-planner" element={<BusinessPlannerPage />} />
            <Route path="/business-plans" element={<BusinessPlansPage />} />
            <Route path="/business-plans/new" element={<BusinessPlanFormPage />} />
            <Route path="/business-plans/:id" element={<BusinessPlanDetailPage />} />
            <Route path="/business-plans/:id/edit" element={<BusinessPlanFormPage />} />
            <Route path="/business-plans/:id/financial-analysis" element={<FinancialAnalysisPage />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
            <Route path="/location" element={<Navigate to="/market-analysis" replace />} />
            <Route path="/location-intelligence" element={<Navigate to="/market-analysis" replace />} />
            <Route path="/location-analysis" element={<Navigate to="/market-analysis" replace />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* ADMIN CONSOLE: Dedicated to Platform Administrators */}
          <Route
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminOverviewPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/businesses" element={<AdminBusinessesPage />} />
            <Route path="/admin/market-data" element={<AdminMarketDataPage />} />
            <Route path="/admin/ml-models" element={<AdminMLPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
