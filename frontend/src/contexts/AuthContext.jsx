import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(decoded);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Invalid token found in storage", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            // Cleanup if token is "undefined" string or similar garbage
            if (token) localStorage.removeItem('token');
            setLoading(false);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token } = res.data.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const decoded = jwtDecode(token);
            setUser(decoded);
            toast.success("Welcome back!");
            return decoded;
        } catch (error) {
            console.error("Login incorrect", error);
            // toast.error handled in component or interceptor usually, but good here too
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        toast.info("Logged out successfully");
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            const { token } = res.data.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const decoded = jwtDecode(token);
            setUser(decoded);
            toast.success("Account created! Welcome.");
            return decoded;
        } catch (error) {
            console.error("Register failed", error);
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
