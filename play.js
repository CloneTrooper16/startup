function beginGame() {
    console.log("It's working! It's working!");
}

class Piece {
    position;
    canMove;
    color;
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
    }
    showMoves() {
        if(!canMove()) {
            return [];
        }
        else if(this.hasMoved) {
            
        }
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
    other;
    vars;
    constructor() {
        a7pawn = new Pawn('a7','black');
        b7pawn = new Pawn('b7','black');
        c7pawn = new Pawn('c7','black');
        d7pawn = new Pawn('d7','black');
        e7pawn = new Pawn('e7','black');
        f7pawn = new Pawn('f7','black');
        g7pawn = new Pawn('g7','black');
        h7pawn = new Pawn('h7','black');
        this.board = [[],
                      [this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn,],
                      [],
                      [],
                      [],
                      [],
                      [],
                      []];
    }
    isEmptySquare(file, rank) {
        if (this.board[file,rank]) {
            return false;
        }
        return true;
    }
    
}