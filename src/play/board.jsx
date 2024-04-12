import React from 'react';
import { Piece } from './piece';

import './board.css';

function Square({ lightDark, value, onSquareClick, status }) {
    const squareClass = `${lightDark} ${status}`;
    //TODO: change selected to status? have board figureout moves and captures?
    return (
        <div className={squareClass} onClick={onSquareClick}>
            <Piece color={value.color} type={value.type} />
        </div>
    );
}

export function Board({ whiteIsNext, squares, onPlay }) {
    const [selectedSquare, setSelectedSquare] = React.useState();
    const [moveOpts, setMoveOpts] = React.useState();
    const [capOpts, setCapOpts] = React.useState();
    function handleClick(row, col) {
        if (isMoveOpt([row, col])) {
            movePiece(row, col, getSelectedPiece());
        }
        else if (squares[row][col] != "") {
            // if (calculateWinner(squares) || squares[i]) {
            //     return;
            // }
            const nextSquares = squares.slice();
            setSelectedSquare([row,col]);
            //TODO: calculate moveOpts/capOpts here
            if (whiteIsNext) {
                // nextSquares[i] = 'X';
            } else {
                // nextSquares[i] = 'O';
            }
            onPlay(nextSquares);
        } else {
            setSelectedSquare(null);
            setMoveOpts(null);
            setCapOpts(null);
        }
    }

    React.useEffect(() => {
        if (selectedSquare) {
            // Calculate moveOpts/capOpts here
            setMoveOpts(getMoves(selectedSquare, getSelectedPiece()));
        }
    }, [selectedSquare]);

    function getSelectedPiece() {
        return squares[selectedSquare[0]][selectedSquare[1]];
    }

    function getStatus(row, col) {
        if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
            return "selected";
        }
        else if (isMoveOpt([row, col])) {
            return "moveOpt";
        }
        else if (1) {
            //check capOpts
        }
    }

    function movePiece(row, col, piece) {

    }

    function isMoveOpt(move) {
        if (moveOpts || capOpts) {
            let result = false;
            moveOpts.forEach( opt => {
                if (areArraysEqual(opt, move)) {
                    result = true;
                }
            });
            if (result == true) {
                return true;
            }
            else {
                moveOpts.forEach( opt => {
                    if (areArraysEqual(opt, move)) {
                        result = true;
                    }
                });
            }
            return false;
        }
        return false;
    }

    function areArraysEqual(ar1, ar2) {
        for (let i = 0; i < ar1.length; i++) {
            if (ar1[i] != ar2[i]) {
                return false;
            }
        }
        return true;
    }

    function isEmpty(row, col) {
        if (squares[row][col] == "") {
            return true;
        }
        return false;
    }
    
    function getMoves(rowCol, piece) {
        const row = rowCol[0];
        const col = rowCol[1];
        let result = [];
        if (piece.type == "p") {
            result = getPawnMoves(row, col, piece);
        }
        return result;
    }
    
    function getPawnMoves(row, col, piece) {
        let result = [];
        if (piece.color == "w") {
            if (isEmpty(row - 1, col)) {
                result.push([row - 1, col]);
                if (row == 6 && isEmpty(row - 2, col)) {
                    result.push([row - 2, col]);
                }
            }
        }
        else {
            if (isEmpty(row + 1, col)) {
                result.push([row + 1, col]);
                if (row == 1 && isEmpty(row + 2, col)) {
                    result.push([row + 2, col]);
                }
            }
        }
        return result;
    }

    return (
        <div className="chessBoard">
            {/* <div className="status">{status}</div> */}
            {squares.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                {row.map((square, colIndex) => (
                    <Square
                        key={colIndex}
                        lightDark={(rowIndex + colIndex) % 2 === 0 ? "lghtSquare" : "darkSquare"}
                        value={square}
                        onSquareClick={() => handleClick(rowIndex, colIndex)}
                        status={getStatus(rowIndex, colIndex)}
                    />
                ))}
                </div>
            ))}
        </div>
    );
}

