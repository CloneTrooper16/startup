import React from 'react';

import { Unauthenticated } from './unauthenticated.jsx';
import { Authenticated } from './authenticated';
import { AuthState } from './authState.js';

export function Login({ userName, authState, onAuthChange }) {
    return (
        <main className='container-fluid bg-secondary text-center'>
            <div>
                {authState !== AuthState.Unknown && <>
                    <h1>Welcome</h1>
                    <p className="smallbotMargin">Login to play chessPawns!</p>
                    </>
                }
                {authState === AuthState.Authenticated && (
                    <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
                )}
                {authState === AuthState.Unauthenticated && (
                    <Unauthenticated
                        userName={userName}
                        onLogin={(loginUserName) => {
                            onAuthChange(loginUserName, AuthState.Authenticated);
                        }}
                    />
                )}
            </div>
        </main>
    );
}