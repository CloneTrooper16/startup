import React from 'react';
import { Board } from './board';
import { GameEvent, GameNotifier } from './gameNotifier';

import './chessGame.css';

export function ChessGame(props) {
    const [history, setHistory] = React.useState([Array.from({ length: 8 }, () => Array(8).fill(null))]);
    const [currentMove, setCurrentMove] = React.useState(0);
    const currentSquares = history[currentMove];
    const whiteIsNext = currentMove % 2 === 0;
    const userName = props.userName;

    const [events, setEvent] = React.useState([]);

    React.useEffect(() => {
      GameNotifier.addHandler(handleGameEvent);
  
      return () => {
        GameNotifier.removeHandler(handleGameEvent);
      };
    });
  
    function handleGameEvent(event) {
      setEvent([...events, event]);
    }

    //add sound here?

    React.useState(() => {
        setHistory(
                [[[
                    {color: "b", type: "r", pos: [0,0]}, 
                    {color: "b", type: "n", pos: [0,1]}, 
                    "", 
                    "", 
                    "", 
                    "", 
                    {color: "b", type: "n", pos: [0,6]}, 
                    {color: "b", type: "r", pos: [0,7]}
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
                    {color: "w", type: "r", pos: [7,0]}, 
                    {color: "w", type: "n", pos: [7,1]},
                    "", 
                    "", 
                    "", 
                    "", 
                    {color: "w", type: "n", pos: [7,6]}, 
                    {color: "w", type: "r", pos: [7,7]}
                ]]]);
    }, []);

    React.useEffect(() => {
        // console.log("event received, updating...");
        for (const [i, event] of events.entries()) { 
            if (event.type == GameEvent.historyUpdate) {
                setHistory(event.value);
                setCurrentMove(event.value.length - 1);
            }
        }
    }, [events]);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        GameNotifier.broadcastEvent(userName, GameEvent.historyUpdate, nextHistory);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    return (
        <div className='playArea'>
            <Board whiteIsNext={whiteIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
    );
}