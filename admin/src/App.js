import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PromptsAdmin from './pages/PromptsAdmin';
import PromptForm from './pages/PromptForm';
import CategoriesAdmin from './pages/CategoriesAdmin';
import AdminsPage from './pages/AdminsPage';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="prompts" element={<PromptsAdmin />} />
        <Route path="prompts/new" element={<PromptForm />} />
        <Route path="prompts/edit/:id" element={<PromptForm />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="admins" element={<AdminsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
