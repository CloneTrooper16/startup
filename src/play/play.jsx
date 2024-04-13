import React from 'react';

import { Players } from './players';
import { ChessGame } from './chessGame';

export function Play({ userName }) {
    return (
        <main>
            <Players userName={userName} />
            <ChessGame userName={userName}/>
        </main>
    );
}