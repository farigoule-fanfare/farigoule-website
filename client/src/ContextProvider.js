import React from 'react';

import AuthProvider from '@providers/AuthProvider';

// Provide the context and handle some app-wide state
function ContextProvider(props) {
    return (
        <AuthProvider>
            {props.children}
        </AuthProvider>
    )
}

export default ContextProvider