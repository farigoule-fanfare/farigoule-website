import React from 'react';

import { AuthProvider } from './context/AuthContext'; // Correct path to our new AuthProvider

// Provide the context and handle some app-wide state
function ContextProvider(props) {
    return (
        <AuthProvider>
            {props.children}
        </AuthProvider>
    )
}

export default ContextProvider