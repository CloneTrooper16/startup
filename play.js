function beginGame() {
    console.log("It's working! It's working!");
}

class Piece {
    position;
    canMove;
    color;
    type;
    constructor(startPosition, color) {
        this.position = startPosition;
        this.color = color;
    }
}

class Pawn extends Piece {
    hasMoved;
    constructor(startPosition, color) {
        super(startPosition, color);
        this.hasMoved = false;
        this.type = "pawn";
    }
    showMoves() {
        if(!this.hasMoved) {
            let moveTwo = game.isEmptySquare(this.color == 'white' ? this.position[0]+2 : this.position[0]-2, this.position[1]);
        }
        let moveOne = game.isEmptySquare(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]);
        console.log("one, two", moveOne, moveTwo);
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
    vars;
    constructor() {
        this.a2pawn = new Pawn([1,0],'white');
        this.b2pawn = new Pawn([1,1],'white');
        this.c2pawn = new Pawn([1,2],'white');
        this.d2pawn = new Pawn([1,3],'white');
        this.e2pawn = new Pawn([1,4],'white');
        this.f2pawn = new Pawn([1,5],'white');
        this.g2pawn = new Pawn([1,6],'white');
        this.h2pawn = new Pawn([1,7],'white');

        this.a7pawn = new Pawn([6,0],'black');
        this.b7pawn = new Pawn([6,1],'black');
        this.c7pawn = new Pawn([6,2],'black');
        this.d7pawn = new Pawn([6,3],'black');
        this.e7pawn = new Pawn([6,4],'black');
        this.f7pawn = new Pawn([6,5],'black');
        this.g7pawn = new Pawn([6,6],'black');
        this.h7pawn = new Pawn([6,7],'black');

        this.board = [[],
                      [this.a2pawn,this.b2pawn,this.c2pawn,this.d2pawn,this.e2pawn,this.f2pawn,this.g2pawn,this.h2pawn],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      [this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn],
                      []];
        this.refreshBoard();
    }

    refreshBoard() {
        this.board.forEach( row => {
            row.forEach( piece => {
                if (piece != "") {
                    let pos = this.getPosString(piece.position[0],piece.position[1]);
                    let pieceType = this.getPieceType(piece.type);
                    let pieceColor = this.getPieceColor(piece.color);
                    let pieceString = pieceColor + pieceType;
                    document.getElementById(pos).firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + pieceString + ".png";
                }
            });
        });
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

    isEmptySquare(rank, file) {
        if (this.board[rank,file] != "") {
            return false;
        }
        return true;
    }
    
    selectPiece(piece) {

    }

    selectSquare(square) {
        if (document.querySelector('.selected') != null) {
            document.querySelector('.selected').classList.remove('selected');
        }
        // console.log(square.id);
        // document.getElementById(square.id).firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
        document.getElementById(square.id).classList.add('selected');
        // // if (document.getElementById(square.id).firstElementChild != null) {
        //     switch(hello) {
                
        //     }
        // // }
        let piece = document.getElementById(square.id).firstElementChild.src;
        if (piece.length > 0) {
            let pieceType = piece.substring(61,63);
            switch(pieceType) {
                default:
                    console.log(pieceType);
            }
            this.selectPiece(pieceType);
        }

    }

}

const game = new Game();