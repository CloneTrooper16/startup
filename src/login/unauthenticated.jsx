import React from 'react';

import Button from 'react-bootstrap/Button';
import {MessageDialog} from './messageDialog';

import './unauthenticated.css';

export function Unauthenticated(props) {
    const [userName, setUserName] = React.useState(props.userName);
    const [password, setPassword] = React.useState('');
    const [displayError, setDisplayError] = React.useState(null);

    async function loginUser() {
        loginOrCreate(`/api/auth/login`);
    }

    async function createUser() {
        loginOrCreate(`/api/auth/create`);
    }

    async function loginOrCreate(endpoint) {
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({userName: userName, password: password}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (response?.status === 200) {
            localStorage.setItem('userName', userName);
            props.onLogin(userName);
        } else {
            const body = await response.json();
            setDisplayError(`⚠ Error: ${body.msg}`);
        }
    }

    return (
        <>
            <div>
                <div className='input-group mb-2'>
                    <input
                        className='form-control'
                        type='text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder='username'
                    />
                </div>
                <div className='input-group mb-3'>
                    <input
                        className='form-control'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='password'
                    />
                </div>
                <div className='loginbuttons'>
                    <Button variant='primary' onClick={() => loginUser()}>
                        Login
                    </Button>
                    <Button variant='primary' onClick={() => createUser()}>
                        Create
                    </Button>
                </div>
            </div>

            <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
        </>
    );
}