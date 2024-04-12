import React from 'react';

import './piece.css';

export function Piece({ color, type }) {
    let piecePNG = "";
    if (color) {
        piecePNG = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + color + type + ".png";
    }
    
    return (
        <img className="piece" src={piecePNG}/>
    )
}