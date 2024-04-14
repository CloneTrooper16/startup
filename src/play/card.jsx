import React from "react";

import "./card.css"

export function Card({ move, cardClass, onCardClick }) {
    const [cardClassName, setCardClassName] = React.useState(cardClass);
    const pieceIMG = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + move.piece.color + move.piece.type + ".png";
    const moveNotation = getNotation(move.move)

    function getNotation(move) {
        let row, col;
        const alphabet = "abcdefgh"
        row = alphabet[move[1]];
        col = 8 - move[0];

        return row + col;
    }

    React.useEffect(() => {
        setCardClassName(cardClass);
        // console.log("testinghere:",cardClass);
    }, [cardClassName]);

    return (
        <div className={`card ${cardClassName}`} onClick={onCardClick}>
            <span className="moveNote">{moveNotation}</span>
            <img className="cardPiece" src={pieceIMG}/>
        </div>
    );
}