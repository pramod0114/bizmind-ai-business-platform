/**
 * BizMind – Root Application & Routing Hierarchy
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { BusinessPlannerPage } from './pages/dashboard/BusinessPlannerPage';
import { MarketAnalysisPage } from './pages/dashboard/MarketAnalysisPage';
import { LocationAnalysisPage } from './pages/dashboard/LocationAnalysisPage';
import { ComparisonPage } from './pages/dashboard/ComparisonPage';
import { PredictionsPage } from './pages/dashboard/PredictionsPage';
import { RecommendationsPage } from './pages/dashboard/RecommendationsPage';
import { SavedPage } from './pages/dashboard/SavedPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { AdminDashboardPage } from './pages/dashboard/AdminDashboardPage';
import { NotFoundPage } from './pages/dashboard/NotFoundPage';

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

          {/* Authenticated Decision Support Dashboard Views */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/business-planner" element={<BusinessPlannerPage />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
            <Route path="/location-analysis" element={<LocationAnalysisPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
