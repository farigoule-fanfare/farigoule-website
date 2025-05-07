import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjusted path
import Loading from './Loading'; // Assuming Loading component is in the same directory or adjust path
import PropTypes from 'prop-types';

//A reusable component to protect private pages if user not authenticated

// TODO check if has required role from user data
function RequireAuth({ children, requiredRole }) {
    const { isAuthenticated, isLoading, currentUser } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // This isLoading is from the AuthContext, which handles the initial auth check.
        return <Loading />;
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for role authorization if a requiredRole is specified
    if (requiredRole) {
        if (!currentUser || !currentUser.roles) {
            // Should not happen if authenticated, but good for safety
            console.warn('RequireAuth: User is authenticated but has no roles data.');
            return <Navigate to="/login" state={{ from: location }} replace />; // Or an unauthorized page
        }
        const userRoles = currentUser.roles.split(',').map(role => role.trim());
        if (!userRoles.includes(requiredRole)) {
            // User is authenticated but does not have the required role
            console.warn(`RequireAuth: Access denied. User does not have the required role: ${requiredRole}. User roles: ${userRoles.join(', ')}`);
            // Redirect to an unauthorized page or home page
            // For now, redirecting to home. An <Unauthorized /> page would be better.
            return <Navigate to="/" replace />; 
            // Or: return <div>Access Denied: You do not have the required permissions.</div>;
        }
    }

    return children; // User is authenticated and (if required) authorized
}

RequireAuth.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string // Expect a single role string, e.g., "admin"
};

export default RequireAuth;