import React from 'react';
import { Board } from './board';

import './chessGame.css';

export function ChessGame(props) {
    const [history, setHistory] = React.useState([Array.from({ length: 8 }, () => Array(8).fill(null))]);
    const [currentMove, setCurrentMove] = React.useState(0);
    const currentSquares = history[currentMove];
    const whiteIsNext = currentMove % 2 === 0;
    const userName = props.userName;
    //add sound here?

    React.useState(() => {
        setHistory(
                [[[
                    "", 
                    {color: "b", type: "n", pos: [0,1]}, 
                    "", 
                    "", 
                    "", 
                    "", 
                    {color: "b", type: "n", pos: [0,6]}, 
                    ""
                ],
                [
                    {color: "b", type: "p", pos:[1,0]},
                    {color: "b", type: "p", pos:[1,1]},
                    {color: "b", type: "p", pos:[1,2]},
                    {color: "b", type: "p", pos:[1,3]},
                    {color: "b", type: "p", pos:[1,4]},
                    {color: "b", type: "p", pos:[1,5]},
                    {color: "b", type: "p", pos:[1,6]},
                    {color: "b", type: "p", pos:[1,7]}
                ],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                [
                    {color: "w", type: "p", pos:[6,0]},
                    {color: "w", type: "p", pos:[6,1]},
                    {color: "w", type: "p", pos:[6,2]},
                    {color: "w", type: "p", pos:[6,3]},
                    {color: "w", type: "p", pos:[6,4]},
                    {color: "w", type: "p", pos:[6,5]},
                    {color: "w", type: "p", pos:[6,6]},
                    {color: "w", type: "p", pos:[6,7]}
                ],
                [
                    "", 
                    {color: "w", type: "n"},
                    "", 
                    "", 
                    "", 
                    "", 
                    {color: "w", type: "n"}, 
                    ""
                ]]]);
    }, []);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    return (
        <div className='playArea'>
            <Board whiteIsNext={whiteIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
    );
}