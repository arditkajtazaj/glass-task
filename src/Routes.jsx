import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import Splash from './pages/auth/Splash';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import FinanceTracker from './pages/finance-tracker';
import SettingsPreferences from './pages/settings-preferences';
import TaskAnalytics from './pages/task-analytics';
import TaskDetailEdit from './pages/task-detail-edit';
import SearchFilterPage from './pages/search-filter';
import TaskDashboard from './pages/task-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Splash />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings-preferences" element={<SettingsPreferences />} />
        <Route path="/account-settings" element={<SettingsPreferences />} />
        <Route path="/task-analytics" element={<TaskAnalytics />} />
        <Route path="/task-detail-edit" element={<TaskDetailEdit />} />
        <Route path="/search-filter" element={<SearchFilterPage />} />
        <Route path="/task-dashboard" element={<TaskDashboard />} />
        <Route path="/finance-tracker" element={<FinanceTracker />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
