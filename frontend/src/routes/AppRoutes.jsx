import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

// Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ChatPage from '../pages/customer/ChatPage'
import FeedbackPage from '../pages/customer/FeedbackPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UsersPage from '../pages/admin/UsersPage'
import FaqManagementPage from '../pages/admin/FaqManagementPage'
import FeedbackManagementPage from '../pages/admin/FeedbackManagementPage'
import AnalyticsDashboardPage from '../pages/admin/AnalyticsDashboardPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default redirect to chat */}
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* Authenticated Customer Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/faqs" element={<FaqManagementPage />} />
        <Route path="/admin/feedback" element={<FeedbackManagementPage />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
