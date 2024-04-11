import React from 'react';

import './scores.css';

export function Scores(props) {
    const [scores, setScores] = React.useState([]);
    const [userScore, setUserScore] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/scores')
        .then((response) => response.json())
        .then((scores) => {
            setScores(scores);
            localStorage.setItem('scores', JSON.stringify(scores));
        })
        .catch(() => {
            const scoresText = localStorage.getItem('scores');
            if (scoresText) {
                setScores(JSON.parse(scoresText));
            }
        });
    }, []);

    React.useEffect(() => {
        fetch(`/api/scores/${props.userName}`)
        .then((response) => response.json())
        .then((userScore) => {
            setUserScore(userScore);
            localStorage.setItem('userScore', JSON.stringify(userScore));
        })
        .catch(() => {
            const scoresText = localStorage.getItem('userScore');
            if (scoresText) {
                setUserScore(JSON.parse(scoresText));
            }
        });
    }, []);

    const scoreRows = [];
    if (scores.length) {
        for (const [i, score] of scores.entries()) {
        scoreRows.push(
            <tr key={i}>
            <td>{i}</td>
            <td>{score.name}</td>
            <td>{score.wins}</td>
            <td>{score.losses}</td>
            </tr>
        );
        }
    } else {
        scoreRows.push(
        <tr key='0'>
            <td colSpan='4'>Be the first to score</td>
        </tr>
        );
    }

    return (
        <main>
            <h1>{props.userName}'s Scores</h1>
            <p id="wins">Wins: {userScore.wins}</p>
            <p id="almostWins">Almost wins: {userScore.losses}</p>
            <h1 className="spacer">High Scores</h1>
            <table className='table table-dark table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
            <tbody id='scores'>{scoreRows}</tbody>
        </table>
        </main>
    );
}