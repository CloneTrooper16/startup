import React from 'react';
import { Piece } from './piece';

import './board.css';

function Square({ lightDark, value, onSquareClick, status }) {
    const squareClass = `${lightDark} ${status}`;
    return (
        <div className={squareClass} onClick={onSquareClick}>
            <Piece color={value.color} type={value.type} />
        </div>
    );
}

export function Board({ whiteIsNext, squares, pColor, onPlay, onWin }) {
    const [selectedSquare, setSelectedSquare] = React.useState();
    const [moveOpts, setMoveOpts] = React.useState();
    const [capOpts, setCapOpts] = React.useState();
    const [movedLast, setMovedLast] = React.useState(0);
    const [isWhiteCheck, setWhiteCheck] = React.useState({check: false, pos: []});
    const [isBlackCheck, setBlackCheck] = React.useState({check: false, pos: []});
    const [winner, setWinner] = React.useState(false);

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
                if (pColor == "w") {
                    setSelectedSquare([row,col]);
                }
            }
            else if (!whiteIsNext && squares[row][col].color == "b") {
                if (pColor == "b") {
                    setSelectedSquare([row,col]);
                }
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
        //check for check
        const check = checkCheck(squares);
        if (check) {
            if (!whiteIsNext) {
                setBlackCheck(check);
                setWhiteCheck({check: false, pos: []});
            } else {
                setWhiteCheck(check);
                setBlackCheck({check: false, pos: []});
            }
        }
        //check for mate
        if (getAllMoves(whiteIsNext ? "w" : "b", squares).length == 0) {
            if (check) {
                if (!whiteIsNext) {
                    console.log("white wins!");
                    setWinner("White");
                    onWin("white");
                } else {
                    console.log("black wins!");
                    setWinner("Black"); 
                    onWin("black");
                }
            } else {
                console.log("Stale mate!");
                setWinner("None");
                onWin("none");
            }
        }
    }, [squares]);

    React.useEffect(() => {
        if (selectedSquare) {
            // Calculate moveOpts/capOpts here
            let opts = getMoves(selectedSquare, getSelectedPiece(), squares);
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
        const nextSquares = deepCopy(squares);
        nextSquares[piece.pos[0]][piece.pos[1]] = "";

        //en pessant
        if (piece.type == "p" && piece.color == "w" && squares[row][col] == "" && col != piece.pos[1]) {
            nextSquares[row + 1][col] = "";
        }
        else if (piece.type == "p" && piece.color == "b" && squares[row][col] == "" && col != piece.pos[1]) {
            nextSquares[row - 1][col] = "";
        }

        //castling
        if (piece.type == "k" && col == piece.pos[1] + 2) {
            const backRow = piece.color == "w" ? 7 : 0;
            const rook = deepCopy(nextSquares[backRow][7]);
            nextSquares[backRow][7] = "";
            rook.pos = [backRow,5];
            nextSquares[backRow][5] = rook;
        }
        else if (piece.type == "k" && col == piece.pos[1] - 2) {
            const backRow = piece.color == "w" ? 7 : 0;
            const rook = deepCopy(nextSquares[backRow][0]);
            nextSquares[backRow][0] = "";
            rook.pos = [backRow,3];
            nextSquares[backRow][3] = rook;
        }

        const newPos = [row, col];
        piece.pos = newPos;
        nextSquares[row][col] = piece;

        if (piece.type == "p" && (row == 0 || row == 7)) {
            piece.type = "q";
            //change to function for more options
        }

        piece.hasMoved = true;

        setSelectedSquare(null);
        setMoveOpts(null);
        setCapOpts(null);
        setMovedLast(piece);
        onPlay(nextSquares);
    }
    
    // function undo() {
    //     goBack();
    // }

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
        if (areArraysEqual(move, isWhiteCheck.pos) || areArraysEqual(move, isBlackCheck.pos)) {
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

    function deepCopy(array) {
        let copy = Array.isArray(array) ? [] : {};

        for (let key in array) {
            if (typeof array[key] === 'object' && array[key] !== null) {
            // Recursively copy nested objects or arrays
            copy[key] = deepCopy(array[key]);
            } else {
            // Copy primitive values
            copy[key] = array[key];
            }
        }
        return copy;
    }

    function isEmpty(row, col, checkSquares) {
        if (row < 8 && row > -1 && col < 8 && col > -1) {
            if (checkSquares[row][col] == "") {
                return true;
            }
        }
        return false;
    }

    function isOpponent(row, col, myColor, checkSquares) {
        if (row < 8 && row > -1 && col < 8 && col > -1) {
            if (checkSquares[row][col] != "") {
                if (checkSquares[row][col].color != myColor) {
                    return true;
                }
            }
        }
        return false;
    }

    function isSafe(row, col, piece, checkSquares) {
        //TODO: change to deal with defended pieces? 
        //works for now with moves but not captures
        if (piece.color == "w") {
            return !checkBlackAttacks(row, col, checkSquares);
        } else {
            return !checkWhiteAttacks(row, col, checkSquares);
        }
    }

    function stopsCheck(row, col, piece) { //
        const hypoSquares = deepCopy(squares);
        hypoSquares[piece.pos[0]][piece.pos[1]] = "";
        const newPos = [row, col];
        let hypoPiece = deepCopy(piece);
        hypoPiece.pos = newPos;
        hypoSquares[row][col] = hypoPiece;
        let result = checkCheck(hypoSquares);
        return !result.check;
    }

    function opensCheck(row, col, piece) {
        if (piece.type !="k" && (isWhiteCheck.check || isBlackCheck.check)) {
            return false;
        }
        const hypoSquares = deepCopy(squares);
        hypoSquares[piece.pos[0]][piece.pos[1]] = "";
        const newPos = [row, col];
        let hypoPiece = deepCopy(piece);
        hypoPiece.pos = newPos;
        hypoSquares[row][col] = hypoPiece;
        let result = checkCheck(hypoSquares);
        return result.check;
    }

    function checkBlackAttacks(row, col, checkSquares) {
        let result = false;
        checkSquares.forEach( r => {
            r.forEach( square => {
                if (square != "" && square.color == "b") {
                    if(checkAttack([square.pos[0], square.pos[1]], [row, col], square, checkSquares)) {
                        result = true;
                        return true;
                    }
                }
            });
        });
        return result;
    }

    function checkWhiteAttacks(row, col, checkSquares) {
        let result = false;
        checkSquares.forEach( r => {
            r.forEach( square => {
                if (square != "" && square.color == "w") {
                    if (checkAttack([square.pos[0], square.pos[1]], [row, col], square, checkSquares)) {
                        result = true;
                        return true;
                    }
                }
            });
        });
        return result;
    }

    function checkAttack(rowCol, attackSquare, piece, checkSquares) {

        //TODO: i belive this needs to work with hypoSquares?
        let result = false;
        let movCaps = [[]];
        if (piece != undefined && piece.type != "p") {
            movCaps = getChecks(rowCol, piece, checkSquares);
        }
        else if (piece != undefined && piece.type == "p") {
            movCaps[0] = getPawnChecks(rowCol[0], rowCol[1], piece, checkSquares);
        }
        movCaps.forEach( ar => {
            ar.forEach( m => {
                if (areArraysEqual(m, attackSquare)) {
                    result = true;
                    return true;
                }
            });
        })
        return result;
    }

    //TODO: use this to get a list of all moves, and then pick three
    function getAllMoves(color, checkSquares) {
        let result = [];
        checkSquares.forEach( r => {
            r.forEach( square => {
                if (square != "" && square.color == color) {
                    let moves = getMoves(square.pos, square, checkSquares);
                    moves.forEach( type => {
                        type.forEach( m => {
                            result.push(m);
                        });
                    });
                }
            });
        });
        return result;
    }

    function checkCheck(checkSquares) {
        let result = {check: false, pos: []};
        if (!whiteIsNext) {
            //see if black is now in check
            const blackKing = getKing("b", checkSquares);
            // result = !isSafe(blackKing.pos[0], blackKing.pos[1], blackKing);
            if (!isSafe(blackKing.pos[0], blackKing.pos[1], blackKing, checkSquares)) {
                result.pos = blackKing.pos;
                result.check = true;
            }
        } else {
            //see if white is now in check
            const whiteKing = getKing("w", checkSquares);
            // result = !isSafe(whiteKing.pos[0], whiteKing.pos[1], whiteKing);
            if (!isSafe(whiteKing.pos[0], whiteKing.pos[1], whiteKing, checkSquares)) {
                result.pos = whiteKing.pos;
                result.check = true;
            }
        }
        return result;
    }

    function getKing(color, checkSquares) {
        let result = "";
        checkSquares.forEach( r => {
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

    function checkLogic(row, col, piece) {
        if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row, col, piece))
                                                     || (isBlackCheck.check && stopsCheck(row, col, piece))) {
                return true;
            }
        return false;
    }
    
    function getMoves(rowCol, piece, checkSquares) {
        const row = rowCol[0];
        const col = rowCol[1];
        let result = [];
        if (piece.type == "p") {
            result[0] = getPawnMoves(row, col, piece, checkSquares);
            result[1] = getPawnCaps(row, col, piece, checkSquares);
        }
        else if (piece.type == "r") {
            result = getRookMoveCaps(row, col, piece, checkSquares);
        }
        else if (piece.type == "n") {
            result = getKnightMoveCaps(row, col, piece, checkSquares);
        }
        else if (piece.type == "b") {
            result = getBishopMoveCaps(row, col, piece, checkSquares);
        }
        else if (piece.type == "q") {
            result = getQueenMoveCaps(row, col, piece, checkSquares);
        }
        else if (piece.type == "k") {
            result = getKingMoveCaps(row, col, piece, checkSquares);
        }
        return result;
    }
    
    function getPawnMoves(row, col, piece, checkSquares) {
        let result = [];
        if (piece.color == "w") {
            if (isEmpty(row - 1, col, checkSquares) && !opensCheck(row - 1, col, piece)) {
                if (!isWhiteCheck.check || (isWhiteCheck.check && stopsCheck(row - 1, col, piece))) {
                    result.push([row - 1, col]);
                }
                if (row == 6 && isEmpty(row - 2, col, checkSquares) && !opensCheck(row - 2, col, piece)) {
                    if (!isWhiteCheck.check || (isWhiteCheck.check && stopsCheck(row - 2, col, piece))) {
                        result.push([row - 2, col]);
                    }
                }
            }
        }
        else {
            if (isEmpty(row + 1, col, checkSquares) && !opensCheck(row + 1, col, piece)) {
                if (!isBlackCheck.check || (isBlackCheck.check && stopsCheck(row + 1, col, piece))) {
                    result.push([row + 1, col]);
                }
                if (row == 1 && isEmpty(row + 2, col, checkSquares) && !opensCheck(row + 2, col, piece)) {
                    if (!isBlackCheck.check || (isBlackCheck.check && stopsCheck(row + 2, col, piece))) {
                        result.push([row + 2, col]);
                    }
                }
            }
        }
        return result;
    }

    function getPawnCaps(row, col, piece, checkSquares) {
        let result = [];
        if (piece.color == "w") {
            if (isOpponent(row - 1, col - 1, piece.color, checkSquares) && !opensCheck(row - 1, col - 1, piece)) {
                if (!isWhiteCheck.check || (isWhiteCheck.check && stopsCheck(row - 1, col - 1, piece))) {
                    result.push([row - 1, col -1]);
                }
            }
            if (isOpponent(row - 1, col + 1, piece.color, checkSquares) && !opensCheck(row - 1, col + 1, piece)) {
                if (!isWhiteCheck.check || (isWhiteCheck.check && stopsCheck(row - 1, col + 1, piece))) {
                    result.push([row - 1, col + 1]);
                }
            }
            if (row == 3) {
                //implement en pessant
                if (movedLast.pos[0] == 3 && (movedLast.pos[1] == col - 1 || movedLast.pos[1] == col + 1) && movedLast.type == "p" && movedLast.color == "b") {
                    if (movedLast.pos[1] == col - 1) {
                        if (!opensCheck(row - 1, col - 1, piece)) {
                            result.push([row - 1, col - 1]);
                        }
                    }
                    else {
                        if (!opensCheck(row - 1, col + 1, piece)) {
                            result.push([row - 1, col + 1]);
                        }
                    }
                }
            }
        } else {
            if (isOpponent(row + 1, col - 1, piece.color, checkSquares) && !opensCheck(row + 1, col - 1, piece)) {
                result.push([row + 1, col -1]);
            }
            if (isOpponent(row + 1, col + 1, piece.color, checkSquares) && !opensCheck(row + 1, col + 1, piece)) {
                result.push([row + 1, col + 1]);
            }
            if (row == 4) {
                //implement en pessant
                if (movedLast.pos[0] == 4 && (movedLast.pos[1] == col - 1 || movedLast.pos[1] == col + 1) && movedLast.type == "p" && movedLast.color == "w") {
                    if (movedLast.pos[1] == col - 1) {
                        if (!opensCheck(row + 1, col - 1, piece)) {
                            result.push([row + 1, col - 1]);
                        }
                    }
                    else {
                        if (!opensCheck(row + 1, col + 1, piece)) {
                            result.push([row + 1, col + 1]);
                        }
                    }
                }
            }
        }
        return result;
    }

    function getPawnChecks(row, col, piece, checkSquares) {
        let result = [];
        if (piece.color == "w") {
            if (isOpponent(row - 1, col - 1, piece, checkSquares)) {
                result.push([row - 1, col -1]);
            }
            if (isOpponent(row - 1, col + 1, piece, checkSquares)) {
                result.push([row - 1, col + 1]);
            }
        } else {
            if (isOpponent(row + 1, col - 1, piece, checkSquares)) {
                result.push([row + 1, col -1]);
            }
            if (isOpponent(row + 1, col + 1, piece, checkSquares)) {
                result.push([row + 1, col + 1]);
            }
        }
        return result;
    }

    function getRookMoveCaps(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        let i = 1;
        while (isEmpty(row + i, col, checkSquares)) {
            if (checkLogic(row + i, col, piece)) {
                if (!opensCheck(row + i, col, piece)) {
                    moves.push([row + i, col]);
                }
            }
            i++;
        }
        if (isOpponent(row + i, col, piece.color, checkSquares)) {
            if (checkLogic(row + i, col, piece)) {
                if (!opensCheck(row + i, col, piece)) {
                    caps.push([row + i, col]);
                }
            }
        }
        i = -1;
        while (isEmpty(row + i, col, checkSquares)) {
            if (checkLogic(row + i, col, piece)) {
                if (!opensCheck(row + i, col, piece)) {
                    moves.push([row + i, col]);
                }
            }
            i--;
        }
        if (isOpponent(row + i, col, piece.color, checkSquares)) {
            if (checkLogic(row + i, col, piece)) {
                if (!opensCheck(row + i, col, piece)) {
                    caps.push([row + i, col]);
                }
            }
        }
        i = 1;
        while (isEmpty(row, col + i, checkSquares)) {
            if (checkLogic(row, col + i, piece)) {
                if (!opensCheck(row, col + i, piece)) {
                    moves.push([row, col + i]);
                }
            }
            i++;
        }
        if (isOpponent(row, col + i, piece.color, checkSquares)) {
            if (checkLogic(row, col + i, piece)) {
                if (!opensCheck(row, col + i, piece)) {
                    caps.push([row, col + i]);
                }
            }
        }
        i = -1;
        while (isEmpty(row, col + i, checkSquares)) {
            if (checkLogic(row, col + i, piece)) {
                if (!opensCheck(row, col + i, piece)) {
                    moves.push([row, col + i]);
                }
            }
            i--;
        }
        if (isOpponent(row, col + i, piece.color, checkSquares)) {
            if (checkLogic(row, col + i, piece)) {
                if (!opensCheck(row, col + i, piece)) {
                    caps.push([row, col + i]);
                }
            }
        }
        
        return [moves, caps];
    }

    function getKnightMoveCaps(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        const moveTypes = [[2,-1],[2,1],[1,2],[-1,2],[-2,-1],[-2,1],[-1,-2],[1,-2]];
        if (!opensCheck(row, col, piece)) {
            moveTypes.forEach(m => {
                // let moveOpt = [row + m[0], col + m[1]];
                if (isEmpty(row + m[0], col + m[1], checkSquares)) {
                    if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + m[0], col + m[1], piece))
                                                                     || (isBlackCheck.check && stopsCheck(row + m[0], col + m[1], piece))) {
                            moves.push([row + m[0], col + m[1]]);
                    }
                }
                else {
                    if (isOpponent(row + m[0], col + m[1], piece.color, checkSquares)) {
                        if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + m[0], col + m[1], piece))
                                                                         || (isBlackCheck.check && stopsCheck(row + m[0], col + m[1], piece))) {
                            caps.push([row + m[0], col + m[1]]);
                        }
                    }
                }
            });
        }
        return [moves, caps];
    }

    function getBishopMoveCaps(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        let i = 1;
        let j = 1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    moves.push([row + i, col + j]);
                }
            }
            i++;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    caps.push([row + i, col + j]);
                }
            }
        }
        i = -1;
        j = 1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    moves.push([row + i, col + j]);
                }
            }
            i--;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    caps.push([row + i, col + j]);
                }
            }
        }
        i = -1;
        j = -1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    moves.push([row + i, col + j]);
                }
            }
            i--;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    caps.push([row + i, col + j]);
                }
            }
        }
        i = 1;
        j = -1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    moves.push([row + i, col + j]);
                }
            }
            i++;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            if ((!isWhiteCheck.check && !isBlackCheck.check) || (isWhiteCheck.check && stopsCheck(row + i, col + j, piece))
                                                             || (isBlackCheck.check && stopsCheck(row + i, col + j, piece))) {
                if (!opensCheck(row + i, col + j, piece)) {
                    caps.push([row + i, col + j]);
                }
            }
        }

        return [moves, caps];
    }

    function getQueenMoveCaps(row, col, piece, checkSquares) {
        let rookMoves = getRookMoveCaps(row, col, piece, checkSquares);
        let bishopMoves = getBishopMoveCaps(row, col, piece, checkSquares);
        rookMoves[0].forEach( m => {
            bishopMoves[0].push(m);
        });
        rookMoves[1].forEach( c => {
            bishopMoves[1].push(c);
        })
        return [bishopMoves[0], bishopMoves[1]];
    }

    function getKingMoveCaps(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        const moveTypes = [[-1,-1],[0,-1],[1,-1],[-1,1],[0,1],[1,1],[-1,0],[1,0]];
        moveTypes.forEach( m => {
            if (isEmpty(row + m[0], col + m[1], checkSquares)) {
                if (checkLogic(row + m[0], col + m[1], piece)) {
                    if (!opensCheck(row + m[0], col + m[1], piece)) {
                        moves.push([row + m[0], col + m[1]]);
                    }
                }
            } else {
                if (isOpponent(row + m[0], col + m[1], piece.color, checkSquares)) {
                    if (checkLogic(row + m[0], col + m[1], piece)) {
                        if (!opensCheck(row + m[0], col + m[1], piece)) {
                            caps.push([row + m[0], col + m[1]]);
                        }
                    }
                }
            }
            // if (isEmpty(row + m[0], col + m[1], checkSquares) && isSafe(row + m[0], col + m[1], piece, squares)) {
            //     moves.push([row + m[0], col + m[1]]);
            // }
        });
        if (!piece.hasMoved) {
            if (checkKingSideCastle(piece, checkSquares)) {
                moves.push([row, col + 2]);
            }
            if (checkQueenSideCastle(piece, checkSquares)) {
                moves.push([row, col - 2]);
            }
        }
        return [moves, caps];
    }

    function checkKingSideCastle(piece, checkSquares) {
        const backRow = piece.color == "w" ? 7 : 0;
        if ((piece.color == "w" && !isWhiteCheck.check) || (piece.color == "b" && !isBlackCheck.check)) {
            if (checkSquares[backRow][5] == "" && checkSquares[backRow][6] == "") {
                const rookSpot = checkSquares[backRow][7];
                if (rookSpot != "" && !rookSpot.hasMoved) {
                    if (isSafe(backRow, 5, piece, checkSquares) && isSafe(backRow, 6, piece, checkSquares)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function checkQueenSideCastle(piece, checkSquares) {
        const backRow = piece.color == "w" ? 7 : 0;
        if ((piece.color == "w" && !isWhiteCheck.check) || (piece.color == "b" && !isBlackCheck.check)) {
            if (checkSquares[backRow][1] == "" && checkSquares[backRow][2] == "" && checkSquares[backRow][3] == "") {
                const rookSpot = checkSquares[backRow][0];
                if (rookSpot != "" && !rookSpot.hasMoved) {
                    if (isSafe(backRow, 2, piece, checkSquares) && isSafe(backRow, 3, piece, checkSquares)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function getChecks(rowCol, piece, checkSquares) {
        const row = rowCol[0];
        const col = rowCol[1];
        let result = [];
        if (piece.type == "r") {
            result = getRookChecks(row, col, piece, checkSquares);
        }
        else if (piece.type == "n") {
            result = getKnightChecks(row, col, piece, checkSquares);
        }
        else if (piece.type == "b") {
            result = getBishopChecks(row, col, piece, checkSquares);
        }
        else if (piece.type == "q") {
            result = getQueenChecks(row, col, piece, checkSquares);
        }
        else if (piece.type == "k") {
            result = getKingChecks(row, col, piece, checkSquares);
        }
        return result;
    }

    function getRookChecks(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        let i = 1;
        while (isEmpty(row + i, col, checkSquares)) {
            moves.push([row + i, col]);
            i++;
        }
        if (isOpponent(row + i, col, piece.color, checkSquares)) {
            caps.push([row + i, col]);
        }
        i = -1;
        while (isEmpty(row + i, col, checkSquares)) {
            moves.push([row + i, col]);
            i--;
        }
        if (isOpponent(row + i, col, piece.color, checkSquares)) {
            caps.push([row + i, col]);
        }
        i = 1;
        while (isEmpty(row, col + i, checkSquares)) {
            moves.push([row, col + i]);
            i++;
        }
        if (isOpponent(row, col + i, piece.color, checkSquares)) {
            caps.push([row, col + i]);
        }
        i = -1;
        while (isEmpty(row, col + i, checkSquares)) {
            moves.push([row, col + i]);
            i--;
        }
        if (isOpponent(row, col + i, piece.color, checkSquares)) {
            caps.push([row, col + i]);
        }

        return [moves, caps];
    }

    function getKnightChecks(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        const moveTypes = [[2,-1],[2,1],[1,2],[-1,2],[-2,-1],[-2,1],[-1,-2],[1,-2]];
        moveTypes.forEach(m => {
            // let moveOpt = [row + m[0], col + m[1]];
            if (isEmpty(row + m[0], col + m[1], checkSquares)) {
                moves.push([row + m[0], col + m[1]]);
            }
            else {
                if (isOpponent(row + m[0], col + m[1], piece.color, checkSquares)) {
                    caps.push([row + m[0], col + m[1]]);
                }
            }
        });
        return [moves, caps];
    }

    function getBishopChecks(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        let i = 1;
        let j = 1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            moves.push([row + i, col + j]);
            i++;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            caps.push([row + i, col + j]);
        }
        i = -1;
        j = 1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            moves.push([row + i, col + j]);
            i--;
            j++;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            caps.push([row + i, col + j]);
        }
        i = -1;
        j = -1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            moves.push([row + i, col + j]);
            i--;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            caps.push([row + i, col + j]);
        }
        i = 1;
        j = -1;
        while (isEmpty(row + i, col + j, checkSquares)) {
            moves.push([row + i, col + j]);
            i++;
            j--;
        }
        if (isOpponent(row + i, col + j, piece.color, checkSquares)) {
            caps.push([row + i, col + j]);
        }

        return [moves, caps];
    }

    function getQueenChecks(row, col, piece, checkSquares) {
        let rookMoves = getRookChecks(row, col, piece, checkSquares);
        let bishopMoves = getBishopChecks(row, col, piece, checkSquares);
        rookMoves[0].forEach( m => {
            bishopMoves[0].push(m);
        });
        rookMoves[1].forEach( c => {
            bishopMoves[1].push(c);
        })
        return [bishopMoves[0], bishopMoves[1]];
    }

    function getKingChecks(row, col, piece, checkSquares) {
        let moves = [];
        let caps = [];
        const moveTypes = [[-1,-1],[0,-1],[1,-1],[-1,1],[0,1],[1,1],[-1,0],[1,0]];
        moveTypes.forEach(m => {
            if (isEmpty(row + m[0], col + m[1], checkSquares)) {
                moves.push([row + m[0], col + m[1]]);
            }
            else {
                if (isOpponent(row + m[0], col + m[1], piece.color, checkSquares)) {
                    caps.push([row + m[0], col + m[1]]);
                }
            }
        });
        return [moves, caps];
    }

    return (
        <>
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
        </>
    );
}

