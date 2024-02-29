function beginGame() {
    console.log("It's working! It's working!");
}

class Piece {
    position;
    canMove;
    color;
    type;
    id;
    constructor(startPosition, color, id) {
        this.position = startPosition;
        this.color = color;
        this.id = id;
    }

    movePiece(square) {
        // console.log(square.id);
        // square.firstElementChild;
        this.hasMoved = true;
        let pos = game.getPosString(this.position[0],this.position[1]);
        let oldSquare = document.getElementById(pos);
        let oldPos = this.position;
        oldSquare.firstElementChild.src = "";

        this.addNewPiece(square);
        
        let pieceID = "id" + this.id;
        console.log("pID", pieceID);
        console.log("sID", square.id);
        this.position = this.getNewPosition(square.id);

        // console.log(oldSquare.classList);
        console.log(this.id);

        oldSquare.classList.remove(pieceID);
        square.classList.add(pieceID);
        console.log(square.classList); //TODO: remove old ID
        this.removeMoves();
        game.deselect();
        game.updateBoard(this.position, oldPos, pieceID);
    }

    addNewPiece(square) {
        let pieceType = game.getPieceType(this.type);
        let pieceColor = game.getPieceColor(this.color);
        let pieceString = pieceColor + pieceType;
        square.firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + pieceString + ".png";
    }

    showMoves() {
        let moves = this.checkMoves();
        if (moves.length > 0) {
            moves.forEach( m => {
                let mySquare = document.getElementById(m);
                mySquare.onclick = this.movePiece.bind(this, mySquare);
                mySquare.classList.add('moveOption');
            });
        }
    }

    removeMoves() {
        let allMoves = document.querySelectorAll(".moveOption");
        allMoves.forEach(move => {
            move.classList.remove('moveOption');
            move.onclick = () => game.selectSquare(move);
        });
    }

    getNewPosition(pos) {
        let file = pos[0];
        let rank = pos[1];
        switch(file) {
            case 'a':
                file = 0;
                break;
            case 'b':
                file = 1;
                break;
            case 'c':
                file = 2;
                break;
            case 'd':
                file = 3;
                break;
            case 'e':
                file = 4;
                break;
            case 'f':
                file = 5;
                break;
            case 'g':
                file = 6;
                break;
            case 'h':
                file = 7;
                break;
        }
        rank--;
        console.log(rank, file);
        return [rank, file];
    }

    // checkMoves() {
    //     return true;
    // }
}

class Pawn extends Piece {
    hasMoved;
    constructor(startPosition, color, id) {
        super(startPosition, color, id);
        this.hasMoved = false;
        this.type = "pawn";
    }
    checkMoves() {
        let moveTwo = false;
        let moves = [];
        let moveOne = game.isEmptySquare(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]);
        if (!this.hasMoved && moveOne) {
            moveTwo = game.isEmptySquare(this.color == 'white' ? this.position[0]+2 : this.position[0]-2, this.position[1]);
        }
        if (moveOne) {
            moves.push(game.getPosString(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]));
        }
        if (moveTwo) {
            moves.push(game.getPosString(this.color == 'white' ? this.position[0]+2 : this.position[0]-2, this.position[1]));
        }
        // console.log(moves);
        return moves;
    }
}

class Rook extends Piece {
    
}

class Knight extends Piece {
    
}

class Bishop extends Piece {
    
}

class Queen extends Piece {
    
}

class King extends Piece {
    
}

class Game {
    board;
    a7pawn;
    b7pawn;
    c7pawn;
    d7pawn;
    e7pawn;
    f7pawn;
    g7pawn;
    h7pawn;

    a2pawn;
    b2pawn;
    c2pawn;
    d2pawn;
    e2pawn;
    f2pawn;
    g2pawn;
    h2pawn;
    selected;
    pieces;

    constructor() {
        this.a2pawn = new Pawn([1,0],'white','pa2');
        this.b2pawn = new Pawn([1,1],'white','pb2');
        this.c2pawn = new Pawn([1,2],'white','pc2');
        this.d2pawn = new Pawn([1,3],'white','pd2');
        this.e2pawn = new Pawn([1,4],'white','pe2');
        this.f2pawn = new Pawn([1,5],'white','pf2');
        this.g2pawn = new Pawn([1,6],'white','pg2');
        this.h2pawn = new Pawn([1,7],'white','ph2');

        this.a7pawn = new Pawn([6,0],'black','pa7');
        this.b7pawn = new Pawn([6,1],'black','pb7');
        this.c7pawn = new Pawn([6,2],'black','pc7');
        this.d7pawn = new Pawn([6,3],'black','pd7');
        this.e7pawn = new Pawn([6,4],'black','pe7');
        this.f7pawn = new Pawn([6,5],'black','pf7');
        this.g7pawn = new Pawn([6,6],'black','pg7');
        this.h7pawn = new Pawn([6,7],'black','ph7');

        this.pieces = [this.a2pawn,this.b2pawn,this.c2pawn,this.d2pawn,this.e2pawn,this.f2pawn,this.g2pawn,this.h2pawn,
                       this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn];

        this.board = [[],
                      [this.a2pawn,this.b2pawn,this.c2pawn,this.d2pawn,this.e2pawn,this.f2pawn,this.g2pawn,this.h2pawn],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      [this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn],
                      []];
        this.selected = null;
        this.resetBoard();
    }

    resetBoard() {
        this.board.forEach( row => {
            row.forEach( piece => {
                if (piece != "") {
                    let pos = this.getPosString(piece.position[0],piece.position[1]);
                    let pieceType = this.getPieceType(piece.type);
                    let pieceColor = this.getPieceColor(piece.color);
                    let pieceString = pieceColor + pieceType;
                    document.getElementById(pos).firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + pieceString + ".png";
                    let pieceID = "id" + piece.id;
                    document.getElementById(pos).classList.add(pieceID);
                }
            });
        });
    }

    updateBoard(newPos, oldPos, pieceID) {
        let movedPiece = this.getPiece(pieceID);
        this.board[newPos[0]][newPos[1]] = movedPiece;
        this.board[oldPos[0]][oldPos[1]] = "";
    }

    getPosString(rank, file) {
        let sFile = 'i';
        let sRank = 8;
        switch(file) {
            case 0:
                sFile = 'a';
                break;
            case 1:
                sFile = 'b';
                break;
            case 2:
                sFile = 'c';
                break;
            case 3: 
                sFile = 'd';
                break;
            case 4:
                sFile = 'e';
                break;
            case 5:
                sFile = 'f';
                break;
            case 6:
                sFile = 'g';
                break;
            case 7: 
                sFile = 'h';
                break;
        }
        switch(rank) {
            case 0:
                sRank = 1;
                break;
            case 1:
                sRank = 2;
                break;
            case 2:
                sRank = 3;
                break;
            case 3: 
                sRank = 4;
                break;
            case 4:
                sRank = 5;
                break;
            case 5:
                sRank = 6;
                break;
            case 6:
                sRank = 7;
                break;
            case 7: 
                sRank = 8;
                break;
        }
        return sFile + sRank;
    }

    getPieceType(typeString) {
        switch(typeString) {
            case 'pawn':
                return 'p';
            case 'rook':
                return 'r';
            case 'knight':
                return 'n';
            case 'bishop':
                return 'b';
            case 'queen':
                return 'q';
            case 'king':
                return 'k';
        }
    }

    getPieceColor(colorString) {
        switch(colorString) {
            case 'black':
                return 'b';
            case 'white':
                return 'w';
        }
    }

    unGetPieceType(type) {
        switch(type) {
            case 'p':
                return 'pawn';
            case 'r':
                return 'rook';
            case 'n':
                return 'knight';
            case 'b':
                return 'bishop';
            case 'q':
                return 'queen';
            case 'k':
                return 'king';
        }
    }

    ungetPieceColor(color) {
        switch(colorString) {
            case 'b':
                return 'black';
            case 'w':
                return 'white';
        }
    }

    getPieceID(classList) {
        let id = 0;
        classList.forEach( c => {
            if(c.substring(0,2) == "id") {
                id = c;
            }
        });
        return id;
    }

    getPiece(pieceID) {
        let id = pieceID.substring(2);
        return this.pieces.find( p => p.id == id);
    }

    isEmptySquare(rank, file) {
        console.log(rank, file);
        if (this.board[rank][file] != "") {
            return false;
        }
        return true;
    }
    
    selectPiece(pieceID) {
        // console.log(pieceID);
        // let type = pieceID.substring(2,3);
        // let pos = pieceID.substring(3);
        // type = this.unGetPieceType(type);
        this.selected = this.getPiece(pieceID);
        // console.log(typeof this.selected.showMoves === 'function');
        this.selected.showMoves();
    }

    deselect() {
        if (this.selected != null) {
            this.selected.removeMoves();
            this.selected = null;
        }
        if (document.querySelector('.selected') != null) {
            document.querySelector('.selected').classList.remove('selected');
        }
    }

    selectSquare(square) {
        if (this.selected != null) {
            this.selected.removeMoves();
            this.selected = null;
        }
        if (document.querySelector('.selected') != null) {
            document.querySelector('.selected').classList.remove('selected');
        }
        // document.getElementById(square.id).firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
        document.getElementById(square.id).classList.add('selected');
        let piece = document.getElementById(square.id).firstElementChild.src;
        // console.log(piece);
        if (piece.includes(".png")) {
            // let pieceType = piece.substring(61,63);
            // switch(pieceType) {
            //     default:
            //         console.log(pieceType);
            // }

            let pieceID = this.getPieceID(document.getElementById(square.id).classList);
            this.selectPiece(pieceID);
        }

    }

}

const game = new Game();