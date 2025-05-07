import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css'; // We will create this file next

function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated, isLoading, error: authError, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/'; // Path to redirect to after login

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier || !password) {
            // Basic client-side validation, AuthContext error will handle backend errors
            // Or set a local error state here if preferred
            alert('Login and password are required.'); 
            return;
        }
        const result = await login({ identifier, password });
        if (result && result.success) {
            navigate(from, { replace: true });
        } 
        // Error handling is done via the 'authError' from context below
    };

    if (isLoading && !currentUser && !isAuthenticated) {
        // Show loading only if initial auth check is happening and user is not yet authenticated
        // or if login process is ongoing.
        return <div className="login-container"><p>Loading...</p></div>;
    }
    
    // If already authenticated (e.g. due to effect redirect not happening instantly, or re-render)
    // it might be better to show null or a redirecting message if the effect hasn't fired.
    // However, the useEffect should handle redirection quickly.

    return (
        <div className="login-container">
            <h1>Enter the Matrix</h1> {/* Inspired by tartiflette.php */}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="identifier">Login (Surnom or Email)</label>
                    <input 
                        type="text" 
                        name="identifier" 
                        id="identifier" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {authError && <p className="error-message">{authError}</p>}
                <div className="form-group">
                    <button type="submit" disabled={isLoading} className="login-button">
                        {isLoading ? 'Connecting...' : 'Se connecter'}
                    </button>
                </div>
            </form>
            <div className="homepage-link-container">
                <Link to="/" className="homepage-link-button">Retour à l'accueil</Link>
            </div>
        </div>
    );
}

export default LoginPage; 