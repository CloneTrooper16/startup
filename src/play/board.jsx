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
    const [movedLast, setMovedLast] = React.useState(0);
    const [isCheck, setCheck] = React.useState(false);

    function handleClick(row, col) {
        if (isMoveOrCapOpt([row, col])) {
            movePiece(row, col, getSelectedPiece());
        }
        else if (squares[row][col] != "") {
            // if (calculateWinner(squares) || squares[i]) {
            //     return;
            // }
            const nextSquares = squares.slice();
            if (whiteIsNext && squares[row][col].color == "w") {
                setSelectedSquare([row,col]);
            }
            else if (!whiteIsNext && squares[row][col].color == "b") {
                setSelectedSquare([row,col]);
            }
            else {
                setSelectedSquare(null);
                setMoveOpts(null);
                setCapOpts(null);
            }
        } else {
            setSelectedSquare(null);
            setMoveOpts(null);
            setCapOpts(null);
        }
    }

    React.useEffect(() => {
        const check = checkCheck(whiteIsNext);
        setCheck(check);
    }, [movedLast]);

    React.useEffect(() => {
        if (selectedSquare) {
            // Calculate moveOpts/capOpts here
            let opts = getMoves(selectedSquare, getSelectedPiece());
            setMoveOpts(opts[0]);
            setCapOpts(opts[1]);
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
        else if (isCapOpt([row, col])) {
            return "capOpt";
        }
        else if (inCheck([row, col])) {
            return "check";
        }
    }

    function movePiece(row, col, piece) {
        const nextSquares = squares.slice();
        nextSquares[piece.pos[0]][piece.pos[1]] = "";

        if (piece.type == "p" && piece.color == "w" && squares[row][col] == "" && col != piece.pos[1]) {
            nextSquares[row + 1][col] = "";
        }
        else if (piece.type == "p" && piece.color == "b" && squares[row][col] == "" && col != piece.pos[1]) {
            nextSquares[row - 1][col] = "";
        }

        const newPos = [row, col];
        piece.pos = newPos;
        nextSquares[row][col] = piece;
        setSelectedSquare(null);
        setMoveOpts(null);
        setCapOpts(null);
        setMovedLast(piece);
        onPlay(nextSquares);
    }

    function isMoveOrCapOpt(move) {
        return isMoveOpt(move) || isCapOpt(move);
    }

    function isMoveOpt(move) {
        if (moveOpts) {
            let result = false;
            moveOpts.forEach( opt => {
                if (areArraysEqual(opt, move)) {
                    result = true;
                }
            });
            if (result == true) {
                return true;
            }
            return false;
        }
        return false;
    }

    function isCapOpt(move) {
        if (capOpts) {
            let result = false;
            capOpts.forEach( opt => {
                if (areArraysEqual(opt, move)) {
                    result = true;
                }
            });
            if (result == true) {
                return true;
            }
            return false;
        }
        return false;
    }

    function inCheck(move) {
        if (areArraysEqual(move, isCheck)) {
            return true;
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
        if (row < 8 && row > -1 && col < 8 && col > -1) {
            if (squares[row][col] == "") {
                return true;
            }
        }
        return false;
    }

    function isOpponent(row, col, myColor) {
        if (row < 8 && row > -1 && col < 8 && col > -1) {
            if (squares[row][col] != "") {
                if (squares[row][col].color != myColor) {
                    return true;
                }
            }
        }
        return false;
    }

    function isSafe(row, col, piece) {
        //TODO: change to deal with defended pieces? 
        //works for now with moves but not captures
        if (piece.color == "w") {
            return !checkBlackAttacks(row, col);
        } else {
            return !checkWhiteAttacks(row, col);
        }
    }

    function checkBlackAttacks(row, col) {
        let result = false;
        squares.forEach( r => {
            r.forEach( square => {
                if (square != "" && square.color == "b" && square.type != "k") {
                    if(checkAttack([square.pos[0], square.pos[1]], [row, col], square)) {
                        result = true;
                        return true;
                    }
                }
            });
        });
        return result;
    }

    function checkWhiteAttacks(row, col) {
        let result = false;
        squares.forEach( r => {
            r.forEach( square => {
                if (square != "" && square.color == "w" && square.type != "k") {
                    if (checkAttack([square.pos[0], square.pos[1]], [row, col], square)) {
                        result = true;
                        return true;
                    }
                }
            });
        });
        return result;
    }

    function checkAttack(rowCol, attackSquare, piece) {
        let result = false;
        let movCaps = [];
        if (piece != undefined && piece.type != "p") {
            movCaps = getMoves(rowCol, piece);
        }
        else if (piece != undefined && piece.type == "p") {
            movCaps[0] = getPawnChecks(rowCol[0], rowCol[1], piece);
        }
        if (movCaps.length) {
            movCaps[0].forEach( m => {
                if (areArraysEqual(m, attackSquare)) {
                    result = true;
                    return true;
                }
            });
        }
        if (movCaps.length > 1) {
            movCaps[1].forEach( m => {
                if (areArraysEqual(m, attackSquare)) {
                    result = true;
                    return true;
                }
            });
        }
        return result;
    }

    function checkCheck(whiteIsNext) {
        let result = [];
        if (!whiteIsNext) {
            //see if black is now in check
            const blackKing = getKing("b");
            // result = !isSafe(blackKing.pos[0], blackKing.pos[1], blackKing);
            if (!isSafe(blackKing.pos[0], blackKing.pos[1], blackKing)) {
                result = blackKing.pos;
            }
        } else {
            //see if white is now in check
            const whiteKing = getKing("w");
            // result = !isSafe(whiteKing.pos[0], whiteKing.pos[1], whiteKing);
            if (!isSafe(whiteKing.pos[0], whiteKing.pos[1], whiteKing)) {
                result = whiteKing.pos;
            }
        }
        return result;
    }

    function getKing(color) {
        let result = "";
        squares.forEach( r => {
            r.forEach( s => {
                if (s != "" && s.type == "k" && s.color == color) {
                    result = s;
                    return;
                }
            });
            if (result != "") {
                return;
            }
        });
        return result;
    }
    
    function getMoves(rowCol, piece) {
        const row = rowCol[0];
        const col = rowCol[1];
        let result = [];
        if (piece.type == "p") {
            result[0] = getPawnMoves(row, col, piece);
            result[1] = getPawnCaps(row, col, piece);
        }
        else if (piece.type == "r") {
            result = getRookMoveCaps(row, col, piece);
        }
        else if (piece.type == "n") {
            result = getKnightMoveCaps(row, col, piece);
        }
        else if (piece.type == "b") {
            result = getBishopMoveCaps(row, col, piece);
        }
        else if (piece.type == "q") {
            result = getQueenMoveCaps(row, col, piece);
        }
        else if (piece.type == "k") {
            result = getKingMoveCaps(row, col, piece);
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

    function getPawnCaps(row, col, piece) {
        let result = [];
        if (piece.color == "w") {
            if (isOpponent(row - 1, col - 1, piece.color)) {
                result.push([row - 1, col -1]);
            }
            if (isOpponent(row - 1, col + 1, piece.color)) {
                result.push([row - 1, col + 1]);
            }
            if (row == 3) {
                //implement en pessant
                if (movedLast.pos[0] == 3 && (movedLast.pos[1] == col - 1 || movedLast.pos[1] == col + 1) && movedLast.type == "p" && movedLast.color == "b") {
                    if (movedLast.pos[1] == col - 1) {
                        result.push([row - 1, col - 1]);
                    }
                    else {
                        result.push([row - 1, col + 1]);
                    }
                }
            }
        } else {
            if (isOpponent(row + 1, col - 1, piece.color)) {
                result.push([row + 1, col -1]);
            }
            if (isOpponent(row + 1, col + 1, piece.color)) {
                result.push([row + 1, col + 1]);
            }
            if (row == 4) {
                //implement en pessant
                if (movedLast.pos[0] == 4 && (movedLast.pos[1] == col - 1 || movedLast.pos[1] == col + 1) && movedLast.type == "p" && movedLast.color == "w") {
                    if (movedLast.pos[1] == col - 1) {
                        result.push([row + 1, col - 1]);
                    }
                    else {
                        result.push([row + 1, col + 1]);
                    }
                }
            }
        }
        return result;
    }

    function getPawnChecks(row, col, piece) {
        let result = [];
        if (piece.color == "w") {
            if (isEmpty(row - 1, col - 1)) {
                result.push([row - 1, col -1]);
            }
            if (isEmpty(row - 1, col + 1)) {
                result.push([row - 1, col + 1]);
            }
        } else {
            if (isEmpty(row + 1, col - 1)) {
                result.push([row + 1, col -1]);
            }
            if (isEmpty(row + 1, col + 1)) {
                result.push([row + 1, col + 1]);
            }
        }
        return result;
    }

    function getRookMoveCaps(row, col, piece) {
        let moves = [];
        let caps = [];
        let i = 1;
        while (isEmpty(row + i, col)) {
            moves.push([row + i, col]);
            i++;
        }
        if (isOpponent(row + i, col, piece.color)) {
            caps.push([row + i, col]);
        }
        i = -1;
        while (isEmpty(row + i, col)) {
            moves.push([row + i, col]);
            i--;
        }
        if (isOpponent(row + i, col, piece.color)) {
            caps.push([row + i, col]);
        }
        i = 1;
        while (isEmpty(row, col + i)) {
            moves.push([row, col + i]);
            i++;
        }
        if (isOpponent(row, col + i, piece.color)) {
            caps.push([row, col + i]);
        }
        i = -1;
        while (isEmpty(row, col + i)) {
            moves.push([row, col + i]);
            i--;
        }
        if (isOpponent(row, col + i, piece.color)) {
            caps.push([row, col + i]);
        }

        return [moves, caps];
    }

    function getKnightMoveCaps(row, col, piece) {
        let moves = [];
        let caps = [];
        const moveTypes = [[2,-1],[2,1],[1,2],[-1,2],[-2,-1],[-2,1],[-1,-2],[1,-2]];
        moveTypes.forEach(m => {
            // let moveOpt = [row + m[0], col + m[1]];
            if (isEmpty(row + m[0], col + m[1])) {
                moves.push([row + m[0], col + m[1]]);
            }
            else {
                if (isOpponent(row + m[0], col + m[1], piece.color)) {
                    caps.push([row + m[0], col + m[1]]);
                }
            }
        });
        return [moves, caps];
    }

    function getBishopMoveCaps(row, col, piece) {
        let moves = [];
        let caps = [];
        let i = 1;
        let j = 1;
        while (isEmpty(row + i, col + j)) {
            moves.push([row + i, col + j]);
            i++;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color)) {
            caps.push([row + i, col + j]);
        }
        i = -1;
        j = 1;
        while (isEmpty(row + i, col + j)) {
            moves.push([row + i, col + j]);
            i--;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color)) {
            caps.push([row + i, col + j]);
        }
        i = -1;
        j = -1;
        while (isEmpty(row + i, col + j)) {
            moves.push([row + i, col + j]);
            i--;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color)) {
            caps.push([row + i, col + j]);
        }
        i = 1;
        j = -1;
        while (isEmpty(row + i, col + j)) {
            moves.push([row + i, col + j]);
            i++;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color)) {
            caps.push([row + i, col + j]);
        }

        return [moves, caps];
    }

    function getQueenMoveCaps(row, col, piece) {
        let rookMoves = getRookMoveCaps(row, col, piece);
        let bishopMoves = getBishopMoveCaps(row, col, piece);
        rookMoves[0].forEach( m => {
            bishopMoves[0].push(m);
        });
        rookMoves[1].forEach( c => {
            bishopMoves[1].push(c);
        })
        return [bishopMoves[0], bishopMoves[1]];
    }

    function getKingMoveCaps(row, col, piece) {
        let moves = [];
        let caps = [];
        const moveTypes = [[-1,-1],[0,-1],[1,-1],[-1,1],[0,1],[1,1],[-1,0],[1,0]];
        moveTypes.forEach( m => {
            if (isEmpty(row + m[0], col + m[1]) && isSafe(row + m[0], col + m[1], piece)) {
                moves.push([row + m[0], col + m[1]]);
            }
        });
        return [moves, caps];
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

