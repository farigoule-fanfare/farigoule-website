import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosWrapper } from '@services/axiosUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context || {
        currentUser: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login: async () => {},
        logout: async () => {},
        checkAuthStatus: async () => {}
    };
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axiosWrapper({ method: 'get', url: 'auth/status' });
            if (data?.isAuthenticated && data?.user) {
                setCurrentUser(data.user);
                setIsAuthenticated(true);
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setCurrentUser(null);
            setIsAuthenticated(false);
            if (err?.response?.status !== 401) {
                console.error("Auth status check failed:", err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axiosWrapper({ method: 'post', url: 'auth/login', data: credentials });
            if (data?.user) {
                setCurrentUser(data.user);
                setIsAuthenticated(true);
            } else {
                throw new Error('Invalid login response');
            }
        } catch (err) {
            setCurrentUser(null);
            setIsAuthenticated(false);
            const msg = err?.response?.data?.message || err.message || 'Login failed.';
            setError(msg);
            console.error("Login error:", msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axiosWrapper({ method: 'post', url: 'auth/logout' });
        } catch (err) {
            console.error("Logout error:", err.message);
        } finally {
            setCurrentUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;