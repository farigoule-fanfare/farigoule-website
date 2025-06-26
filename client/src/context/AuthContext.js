import React, { createContext, useContext, useState, useEffect } from 'react';
import {axiosWrapper} from '@api/axiosUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    // If context is null (initial state before provider is ready or if not logged in initially),
    // provide a default structure to prevent destructuring errors in consumers.
    // Consumers should still check isAuthenticated.
    return context || { 
        currentUser: null, 
        isAuthenticated: false, 
        isLoading: true, // Default to true until checkAuthStatus runs
        error: null,
        login: async () => {}, 
        logout: async () => {},
        checkAuthStatus: async () => {} 
    };
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true until initial check
    const [error, setError] = useState(null);

    // Function to check auth status (e.g., on app load)
    const checkAuthStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Corrected call to axiosWrapper
            const response = await axiosWrapper({ 
                method: 'get', 
                url: 'api/auth/status' 
            });
            // The axiosWrapper seems to return { success: true, data: resGet.data.data ... } for GET
            // and for POST, it returns resPost.data which itself should contain { success, user, ... }
            // The actual user data from /auth/status in backend is response.data.user
            // The backend for /auth/status returns { isAuthenticated: true, user: req.user }
            // So response.data from axiosWrapper for GET will be the { isAuthenticated, user } object if successful.

           if (response && response.success && response.isAuthenticated && response.user) {
                setCurrentUser(response.user);
                setIsAuthenticated(true);
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
                if (response && !response.success) {
                    // Don't set an error for auth status check failure, just log it
                    console.error("Auth status check failed (API):", response.errorReason || response.error || 'Unknown error');
                }
            }
        } catch (err) { // This catch is for unexpected errors not handled by axiosWrapper returning success:false
            setCurrentUser(null);
            setIsAuthenticated(false);
            console.error("Auth status check failed (Exception):", err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Check auth status when the provider mounts
    useEffect(() => {
        checkAuthStatus();
    }, []);


    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            // Corrected call to axiosWrapper
            const response = await axiosWrapper({ 
                method: 'post', 
                url: 'api/auth/login', 
                data: credentials 
            });

            // Assuming backend /auth/login sends { message: '...', user: {...}, success: true (implicit from axiosWrapper structure) }
            // and axiosWrapper for POST returns the whole backend response.data if successful
            if (response && response.success && response.user) { // axiosWrapper success + backend has user object
                setCurrentUser(response.user);
                setIsAuthenticated(true);
                return { success: true, user: response.user };
            } else {
                setIsAuthenticated(false);
                setCurrentUser(null);
                const errorMessage = response.message || response.errorReason || 'Login failed. Please try again.';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (err) { // This catch is for unexpected errors not handled by axiosWrapper returning success:false
            setIsAuthenticated(false);
            setCurrentUser(null);
            const errorMessage = 'Login failed due to an unexpected error.';
            setError(errorMessage);
            console.error("Login error (Exception):", err.message);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Corrected call to axiosWrapper, no data needed for logout POST
            await axiosWrapper({ 
                method: 'post', 
                url: 'api/auth/logout' 
            });
            // We don't typically need to check response for logout other than it didn't throw an error
        } catch (err) { // This catch is for unexpected errors not handled by axiosWrapper returning success:false
            console.error("Logout API error (Exception):", err.message);
            // setError("Logout failed on server, but you are logged out locally.");
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
        checkAuthStatus // Expose if manual refresh is needed, though auto-runs on load
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 