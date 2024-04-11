import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';

import { Scores } from './scores/scores';
import { About } from './about/about';
import { AuthState } from './login/authState.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <div className='leftHeader'>
                        <h1 className='htop'>
                            RandomChess
                        </h1>
                        <nav className='navbar'> 
                            <menu className='navbar-nav'>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to=''>
                                        Login
                                    </NavLink>
                                </li>
                                {authState === AuthState.Authenticated && (
                                    <li className='nav-item'>
                                        <NavLink className='nav-link' to='play'>
                                            Play
                                        </NavLink>
                                    </li>
                                )}
                                {authState === AuthState.Authenticated && (
                                    <li className='nav-item'>
                                        <NavLink className='nav-link' to='scores'>
                                            Scores
                                        </NavLink>
                                    </li>
                                )}
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='about'>
                                        About
                                    </NavLink>
                                </li>
                            </menu>
                        </nav>
                    </div>
                </header>

                <Routes>
                    <Route
                        path='/'
                        element={
                            <Login
                                userName={userName}
                                authState={authState}
                                onAuthChange={(userName, authState) => {
                                setAuthState(authState);
                                setUserName(userName);
                                }}
                            />
                        }
                        exact
                    />
                    {/* <Route path='/play' element={<Play userName={userName} />} /> */}
                    <Route path='/scores' element={<Scores userName={userName}/>} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <a className="sourceLink" href="https://github.com/CloneTrooper16/startup">Spencer Winward's GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;