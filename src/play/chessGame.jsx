import React from 'react';
import { Board } from './board';
import { GameEvent, GameNotifier } from './gameNotifier';
import { PlayerName } from './playerName';
import { Card } from './card';
import Button from 'react-bootstrap/Button';

import './chessGame.css';

export function ChessGame(props) {
    const [history, setHistory] = React.useState([Array.from({ length: 8 }, () => Array(8).fill(null))]);
    const [currentMove, setCurrentMove] = React.useState(0);
    const currentSquares = history[currentMove];
    const whiteIsNext = currentMove % 2 === 0;
    const userName = props.userName;
    const [playerColor, setPlayerColor] = React.useState();
    const [oppColor, setOppColor] = React.useState();
    const [oppName, setOppName] = React.useState("UnknownAdversary");
    

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
    //initialize board
    React.useState(() => {
        setHistory(
                [[[
                    {color: "b", type: "r", pos: [0,0], hasMoved: false}, 
                    {color: "b", type: "n", pos: [0,1], hasMoved: false}, 
                    {color: "b", type: "b", pos: [0,2], hasMoved: false}, 
                    {color: "b", type: "q", pos: [0,3], hasMoved: false}, 
                    {color: "b", type: "k", pos: [0,4], hasMoved: false}, 
                    {color: "b", type: "b", pos: [0,5], hasMoved: false}, 
                    {color: "b", type: "n", pos: [0,6], hasMoved: false}, 
                    {color: "b", type: "r", pos: [0,7], hasMoved: false}
                ],
                [
                    {color: "b", type: "p", pos:[1,0], hasMoved: false},
                    {color: "b", type: "p", pos:[1,1], hasMoved: false},
                    {color: "b", type: "p", pos:[1,2], hasMoved: false},
                    {color: "b", type: "p", pos:[1,3], hasMoved: false},
                    {color: "b", type: "p", pos:[1,4], hasMoved: false},
                    {color: "b", type: "p", pos:[1,5], hasMoved: false},
                    {color: "b", type: "p", pos:[1,6], hasMoved: false},
                    {color: "b", type: "p", pos:[1,7], hasMoved: false}
                ],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", ""],
                [
                    {color: "w", type: "p", pos:[6,0], hasMoved: false},
                    {color: "w", type: "p", pos:[6,1], hasMoved: false},
                    {color: "w", type: "p", pos:[6,2], hasMoved: false},
                    {color: "w", type: "p", pos:[6,3], hasMoved: false},
                    {color: "w", type: "p", pos:[6,4], hasMoved: false},
                    {color: "w", type: "p", pos:[6,5], hasMoved: false},
                    {color: "w", type: "p", pos:[6,6], hasMoved: false},
                    {color: "w", type: "p", pos:[6,7], hasMoved: false}
                ],
                [
                    {color: "w", type: "r", pos: [7,0], hasMoved: false}, 
                    {color: "w", type: "n", pos: [7,1], hasMoved: false},
                    {color: "w", type: "b", pos: [7,2], hasMoved: false}, 
                    {color: "w", type: "q", pos: [7,3], hasMoved: false}, 
                    {color: "w", type: "k", pos: [7,4], hasMoved: false}, 
                    {color: "w", type: "b", pos: [7,5], hasMoved: false}, 
                    {color: "w", type: "n", pos: [7,6], hasMoved: false}, 
                    {color: "w", type: "r", pos: [7,7], hasMoved: false}
                ]]]);
    }, []);

    React.useEffect(() => {
        // console.log("event received, updating...");
        for (const [i, event] of events.entries()) { 
            if (event.type == GameEvent.historyUpdate) {
                setHistory(event.value);
                setCurrentMove(event.value.length - 1);
            } else if (event.type == GameEvent.colorPick) {
                setOppName(event.from);
                setOppColor(event.value == "white" ? "white" : "black");
            }
        }
    }, [events]);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        GameNotifier.broadcastEvent(userName, GameEvent.historyUpdate, nextHistory);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleWin(winner) {
        if (winner == playerColor) {
            saveScore("win");
        }
        else if (winner == "none") {
            //display something?
        }
    }

    function handleMoveCards() {
        
    }

    function pickColor(color) {
        setPlayerColor(color);
        GameNotifier.broadcastEvent(userName, GameEvent.colorPick, color);
    }

    async function saveScore(score) {
        // console.log(score);
        // const userName = this.getPlayerName();
        // const date = new Date().toLocaleDateString();
        let wins, losses;
        if (score == "win") {
            wins = 1;
            losses = 0;
        } else {
            wins = 0;
            losses = 1;
        }
        const newScore = {name: userName, wins: wins, losses: losses};
    
        try {
            const response = await fetch('/api/score', {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newScore),
            });
            const scores = await response.json();
            localStorage.setItem('scores', JSON.stringify(scores));
        } 
        catch {
            // If there was an error then just track scores locally
            // this.updateScoresLocal(newScore);
            console.log("error putting score");
        }
    }

    if (playerColor == null) {
        return (
            <div className='playArea'>
                <PlayerName userName={"Black"} userIcon={"Gray"}/>
                <Button variant="primary" className="colorPicker" onClick={() => pickColor("black")}>
                    Play Black
                </Button>
                <PlayerName userName={"White"} userIcon={"Black"}/>
                <Button variant="primary" className="colorPicker" onClick={() => pickColor("white")}>
                    Play White
                </Button>
            </div>
        );
    } else {
        return (
            <>
                <div className='playArea'>
                    <PlayerName userName={playerColor == "black" ? userName : oppName} 
                        userIcon={playerColor == "black" ? userName : oppName}
                    />
                    <Board whiteIsNext={whiteIsNext} squares={currentSquares} pColor={playerColor[0]} onPlay={handlePlay} onWin={handleWin} setRandomMoves={handleMoveCards}/>
                    <PlayerName userName={playerColor == "white" ? userName : oppName} 
                        userIcon={playerColor == "white" ? userName : oppName}
                    />
                </div>
                <div className="moveCards">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </div>
            </>
        );
    }
}