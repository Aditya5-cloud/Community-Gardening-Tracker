import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Layout and Common Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';
import Landing from './components/layout/Landing';

// Page Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import CommunityDashboard from './components/dashboard/CommunityDashboard';
import DiscoverCommunities from './components/dashboard/DiscoverCommunities';
import CreateCommunity from './components/gardens/CreateCommunity';
import GardenDashboard from './components/gardens/GardenDashboard';
import Profile from './components/profile/Profile';
import CreatePlant from './components/plants/CreatePlant';
import CreateEvent from './components/events/CreateEvents.js';
import CreateTask from './components/tasks/CreateTask';
import CommunityChat from './components/chat/CommunityChat';

function App() {
  return (
    <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes inside Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CommunityDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/discover"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DiscoverCommunities />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateCommunity />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens/:gardenId/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <GardenDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plants/garden/:gardenId/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatePlant />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/garden/:gardenId/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateEvent />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/garden/:gardenId/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateTask />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/garden/:gardenId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CommunityChat />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback for Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;