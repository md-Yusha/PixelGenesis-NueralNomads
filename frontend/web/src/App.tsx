import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './routes/Home';
import { Login } from './routes/Auth/Login';
import { Register } from './routes/Auth/Register';
import { HolderDashboard } from './routes/Holder/Dashboard';
import { MyCredentials } from './routes/Holder/MyCredentials';
import { IssuerDashboard } from './routes/Issuer/Dashboard';
import { IssueCredential } from './routes/Issuer/IssueCredential';
import { VerifyCredential } from './routes/Verifier/VerifyCredential';
import { apiClient } from './lib/apiClient';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = apiClient.getToken();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/holder/dashboard"
          element={
            <ProtectedRoute>
              <HolderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/holder/credentials"
          element={
            <ProtectedRoute>
              <MyCredentials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issuer/dashboard"
          element={
            <ProtectedRoute>
              <IssuerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issuer/issue"
          element={
            <ProtectedRoute>
              <IssueCredential />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verifier/verify"
          element={
            <ProtectedRoute>
              <VerifyCredential />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

