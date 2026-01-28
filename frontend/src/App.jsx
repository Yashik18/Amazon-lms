import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Layout/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';

// Theme
import theme from './theme';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage'));
const ScenariosPage = lazy(() => import('./pages/ScenariosPage'));
const ModulesPage = lazy(() => import('./pages/ModulesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Protected User Route
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <LoadingScreen height="100vh" />;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protected Admin Route
const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <LoadingScreen height="100vh" />;
    return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Trigger loader on route change
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Navbar />
            {loading ? (
                <LoadingScreen height="80vh" />
            ) : (
                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                    <Suspense fallback={<LoadingScreen height="80vh" />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <DashboardPage />
                                </PrivateRoute>
                            } />

                            <Route path="/chat" element={
                                <PrivateRoute>
                                    <ChatPage />
                                </PrivateRoute>
                            } />

                            <Route path="/workflows" element={
                                <PrivateRoute>
                                    <WorkflowsPage />
                                </PrivateRoute>
                            } />

                            <Route path="/scenarios" element={
                                <PrivateRoute>
                                    <ScenariosPage />
                                </PrivateRoute>
                            } />

                            <Route path="/modules" element={
                                <PrivateRoute>
                                    <ModulesPage />
                                </PrivateRoute>
                            } />

                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminPage />
                                </AdminRoute>
                            } />
                        </Routes>
                    </Suspense>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </Box>
            )}
        </Box>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <Router>
                    <AuthProvider>
                        <AppRoutes />
                        <ToastContainer position="bottom-right" />
                    </AuthProvider>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
