import React from 'react';
import './about.css';

export function About(props) {
    const [quote, setQuote] = React.useState('Loading...');

    React.useEffect(() => {
        const random = getRandomID();
        fetch(`https://api.adviceslip.com/advice/${random}`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            const containerEl = document.querySelector('#quote');
            containerEl.textContent = '';
            const adviceEl = document.createElement('p');
            adviceEl.classList.add('quote');
            adviceEl.textContent = data.slip.advice;
            containerEl.appendChild(adviceEl);
        })
        .catch();
    }, []);


    return (
        <main>
            <div id="picture" className="pictureBox"><img src="assets/coolBanner.jpeg" /></div>
            <h1>About RandomChess</h1>
            <p>RandomChess is basically the best game where you can either win or almost win!</p>
            <p>The goal of the game is to get a pawn to the back row before your opponent can</p>
            <p>Chess piece assets are owned by Chess.com and are used for educational purposes</p>
            <div id="quote" className="quote-box"></div>
        </main>
    );
}

function getRandomID() {
    const bannedIDs = [24,27,28,29,31,33,34,37,38,46,75,76,80,93,114,181,183,203];
    let brokenIDs = [22,48,67,225];
    let random = 0;
    do {
        random = Math.floor(Math.random() * 224) + 1;
    } while (bannedIDs.find(id => id == random) || brokenIDs.find(id => id == random));
    return random;
}