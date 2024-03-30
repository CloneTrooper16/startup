function beginGame() {
    console.log("It's working! It's working!");
}

function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

function getPlayerIcon() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

class Piece {
    hasMoved;
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
        this.movePieceRemote(square);
        game.broadcastEvent(game.getPlayerName(), "pieceMoved", {piece: this, movSquare: square.id});
        game.broadcastEvent(game.getPlayerName(), "turnTaken", this.playerColor);
    }

    movePieceRemote(square) {
        this.hasMoved = true;
        let pos = game.getPosString(this.position[0],this.position[1]);
        let oldSquare = document.getElementById(pos);
        let oldPos = this.position;
        oldSquare.firstElementChild.src = "";
        
        let pieceID = "id" + this.id;
        this.position = this.getNewPosition(square.id);
        if(!game.isEmptySquare(this.position[0],this.position[1])) {
            game.removeCapture(square);
        }

        this.addNewPiece(square);

        oldSquare.classList.remove(pieceID);
        square.classList.add(pieceID);
        let notation = this.getMoveNotation(square.id);
        console.log(notation);
        game.moveList.push(notation); //TODO: make it work with piece notation that isnt just pawn moves 
        this.removeMoves();
        game.deselect();
        game.updateBoard(this.position, oldPos, pieceID);
        game.checkVictory(this.position[0], this.type);
    }

    addNewPiece(square) {
        let pieceType = game.getPieceType(this.type);
        let pieceColor = game.getPieceColor(this.color);
        let pieceString = pieceColor + pieceType;
        square.firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + pieceString + ".png";
    }

    showMoves() {
        let moves = this.checkMoves();
        let captures = this.checkCaptures();
        if (moves.length > 0) {
            moves.forEach( m => {
                let mySquare = document.getElementById(m);
                mySquare.onclick = this.movePiece.bind(this, mySquare);
                mySquare.classList.add('moveOption');
            });
        }
        if (captures.length > 0) {
            captures.forEach( m => {
                let mySquare = document.getElementById(m);
                mySquare.onclick = this.movePiece.bind(this, mySquare);
                mySquare.classList.add('captureOption');
            });
        }
    }

    removeMoves() {
        let allMoves = document.querySelectorAll(".moveOption");
        let allCaptures = document.querySelectorAll(".captureOption");
        allMoves.forEach(move => {
            move.classList.remove('moveOption');
            move.onclick = () => game.selectSquare(move);
        });
        allCaptures.forEach(cap => {
            cap.classList.remove('captureOption');
            cap.onclick = () => game.selectSquare(cap);
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
        return [rank, file];
    }

    getMoveNotation(square) {
        //TODO:: return the notation of the move
        switch(this.type) {
            case 'pawn':
                return square;
        }
    }

    isSquare(rank, file) {
        if ((rank < 8 && rank > -1) && (file < 8 && file > -1)) {
            return true;
        }
        return false;
    }

    // checkMoves() {
    //     return true;
    // }
}

class Pawn extends Piece {
    constructor(startPosition, color, id) {
        super(startPosition, color, id);
        this.hasMoved = false;
        this.type = "pawn";
    }

    checkMoves() {
        let moveTwo = false;
        let moves = [];
        if (this.color == 'white' ? this.position[0]+1 < 8 : this.position[0]-1 > -1) {
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
            // moves.push(...this.checkCaptures());
        }

        return moves;
    }

    checkCaptures() {
        let captures = [];
        let captureOne = false;
        let captureTwo = false;
            if (this.position[1] > 0) {
            captureOne = !game.isEmptySquare(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]-1)
                         && game.checkPieceColor(this.color, [this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]-1]);
        }
        if (this.position[1] < 7) {
            captureTwo = !game.isEmptySquare(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]+1)
                          && game.checkPieceColor(this.color, [this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]+1]);
        }
        if (captureOne) {
            captures.push(game.getPosString(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]-1));
        }
        if (captureTwo) {
            captures.push(game.getPosString(this.color == 'white' ? this.position[0]+1 : this.position[0]-1, this.position[1]+1));
        }
        return captures;
    }
}

class Rook extends Piece {
    
}

class Knight extends Piece {
    moveTypes;
    constructor(startPosition, color, id) {
        super(startPosition, color, id);
        this.hasMoved = false;
        this.type = "knight";
        this.moveTypes = [[2,-1],[2,1],[1,2],[-1,2],[-2,-1],[-2,1],[-1,-2],[1,-2]];
    }

    checkMoves() {
        let moves = [];
        let capOptions = [];
        this.moveTypes.forEach(m => {
            let moveOpt = [this.position[0] + m[0], this.position[1] + m[1]];
            if (this.isSquare(moveOpt[0], moveOpt[1])) {
                if (game.isEmptySquare(moveOpt[0],moveOpt[1])) {
                    moves.push(game.getPosString(moveOpt[0], moveOpt[1]));
                }
                else {
                    capOptions.push(moveOpt);
                }
            }
        });
        let captures = this.checkCaptures(capOptions);
        return [moves, captures];
    }

    checkCaptures(capOptions) {
        let captures = [];
        capOptions.forEach( c => {
            if (game.checkPieceColor(this.color, c)) {
                captures.push(game.getPosString(c[0], c[1]))
            }
        });
        return captures;
    }

    showMoves() {
        let moveCaps = this.checkMoves();
        let moves = moveCaps[0];
        let captures = moveCaps[1];
        if (moves.length > 0) {
            moves.forEach( m => {
                let mySquare = document.getElementById(m);
                mySquare.onclick = this.movePiece.bind(this, mySquare);
                mySquare.classList.add('moveOption');
            });
        }
        if (captures.length > 0) {
            captures.forEach( m => {
                let mySquare = document.getElementById(m);
                mySquare.onclick = this.movePiece.bind(this, mySquare);
                mySquare.classList.add('captureOption');
            });
        }
    }
}

class Bishop extends Piece {
    
}

class Queen extends Piece {
    
}

class King extends Piece {
    
}

class Game {
    board;

    b8knight;
    g8knight;

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

    b1knight;
    g1knight;

    selected;
    pieces;
    gameOver;
    moveList;
    whiteTurn;
    socket;
    playerColor;

    constructor() {
        this.b1knight = new Knight([0,1],'white', 'nb1');
        this.g1knight = new Knight([0,6],'white', 'ng1');

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

        this.b8knight = new Knight([7,1],'black', 'nb8');
        this.g8knight = new Knight([7,6],'black', 'ng8');

        this.pieces = [this.b1knight, this.g1knight, 
                       this.a2pawn,this.b2pawn,this.c2pawn,this.d2pawn,this.e2pawn,this.f2pawn,this.g2pawn,this.h2pawn,
                       this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn,
                       this.b8knight, this.g8knight];

        this.board = [["", this.b1knight, "", "", "", "", this.g1knight, ""],
                      [this.a2pawn,this.b2pawn,this.c2pawn,this.d2pawn,this.e2pawn,this.f2pawn,this.g2pawn,this.h2pawn],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      ["", "", "", "", "", "", "", ""],
                      [this.a7pawn,this.b7pawn,this.c7pawn,this.d7pawn,this.e7pawn,this.f7pawn,this.g7pawn,this.h7pawn],
                      ["", this.b8knight, "", "", "", "", this.g8knight, ""]];
        this.selected = null;
        this.gameOver = false;
        this.moveList = [];
        this.whiteTurn = true;
        this.resetBoard(this.board);
        this.checkPlayerColor();
        this.configureWebSocket();
    }

    resetBoard(board) {
        this.board = board;
        board.forEach( row => {
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
        this.moveList = [];
    }

    updateBoard(newPos, oldPos, pieceID) {
        let movedPiece = this.getPiece(pieceID);
        this.board[newPos[0]][newPos[1]] = movedPiece;
        this.board[oldPos[0]][oldPos[1]] = "";
    }

    checkPlayerColor() {
        if (this.playerColor != "black" || this.playerColor != "white") {
            const colorChoices = document.querySelector('#colorChoices');
            colorChoices.innerHTML =
                `<div class="colorChoose">Pick your color</div>
                <button type="button" class="btn btn-primary blackBtn" onclick="game.setPlayerColor('black')">Black</button>
                <button type="button" class="btn btn-primary whiteBtn" onclick="game.setPlayerColor('white')">White</button>`;
        }
    }

    setPlayerColor(color) {
        this.playerColor = color;
        const colorChoices = document.querySelector('#colorChoices');
        colorChoices.innerHTML = `<div class="${color}Player">Your team: ${color}</div>`;
        this.setIcons(this.getPlayerName(), getPlayerIcon(), color);
        this.broadcastEvent(this.getPlayerName(), "colorPick", {pColor: color, pName: this.getPlayerName(), pIcon: getPlayerIcon()});
    }

    setIcons(playerName, icon, color) {
        if (color == 'white') {
            const whiteNameEl = document.querySelector('.playerWName');
            const whiteIconEl = document.querySelector('.playerWIcon');
            whiteNameEl.textContent = playerName;
            whiteIconEl.src = "https://robohash.org/" + icon + ".png";
        }
        else {
            const blackNameEl = document.querySelector('.playerBName');
            const blackIconEl = document.querySelector('.playerBIcon');
            blackNameEl.textContent = playerName;
            blackIconEl.src = "https://robohash.org/" + icon + ".png";
        }
    }
    
    checkVictory(pos, piece) {
        if (piece == "pawn") {
            if (pos == 7) {
                document.getElementById("victor").textContent = "White Wins!";
                this.saveScore('win');
                this.gameOver = true;
            }
            else if (pos == 0) {
                document.getElementById("victor").textContent = "Black Wins!";
                this.saveScore('loss');
                this.gameOver = true;
            }
        }
    }

    checkPieceColor(myColor, otherSquare) {
        let otherColor = this.getColor(otherSquare);
        if (myColor == otherColor) {
            return false;
        }
        else {
            return true;
        }
    }

    removeCapture(square) {
        let capPiece = this.getPieceOnSquare(square);
        let capID = "id" + capPiece.id;
        square.classList.remove(capID);
        let pieceToRemove = this.pieces.findIndex(p => p.id == capPiece.id);
        this.pieces.splice(pieceToRemove,1);
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

    getPieceOnSquare(square) {
        let pos = this.getPosfromString(square.id);
        return this.board[pos[0]][pos[1]];
    }

    getPosfromString(pos) {
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
        return [rank, file];
    }

    getColor(piecePos) {
        return this.pieces.find( p => p.position[0] == piecePos[0] && p.position[1] == piecePos[1]).color;
    }

    getSquare(squareID) {
        return document.getElementById(squareID);
    }

    isEmptySquare(rank, file) {
        if (this.board[rank][file] != "") {
            return false;
        }
        return true;
    }
    
    selectPiece(pieceID) {
        // let type = pieceID.substring(2,3);
        // let pos = pieceID.substring(3);
        // type = this.unGetPieceType(type);
        this.selected = this.getPiece(pieceID);
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
        if (!this.gameOver) {
            // document.getElementById(square.id).firstElementChild.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
            document.getElementById(square.id).classList.add('selected');
            let piece = document.getElementById(square.id).firstElementChild.src;

            if (piece.includes(".png")) {
                // let pieceType = piece.substring(61,63);
                let color = piece.substring(61,62);
                if (this.playerColor && color == this.playerColor.at(0)) {
                    if (color == 'w' && this.whiteTurn || color == 'b' && !this.whiteTurn) {
                        let pieceID = this.getPieceID(document.getElementById(square.id).classList);
                        this.selectPiece(pieceID);
                    }
                }
            }
        }
    }

    getPlayerName() {
        return localStorage.getItem('userName') ?? 'Mystery player';
    }
    async saveScore(score) {
        console.log(score);
        const userName = this.getPlayerName();
        // const date = new Date().toLocaleDateString();
        let wins, losses;
        if (score == "win") {
            wins = 1;
            losses = 0;
        } else {
            wins = 0;
            losses = 1;
        }
        const newScore = {name: userName, wins: wins, losses: losses};
    
        try {
            const response = await fetch('/api/score', {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newScore),
            });
            const scores = await response.json();
            localStorage.setItem('scores', JSON.stringify(scores));
        } 
        catch {
            // If there was an error then just track scores locally
            // this.updateScoresLocal(newScore);
            console.log("eror");
        }
    }

    // Functionality for peer communication using WebSocket

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
            this.displayMsg('system', 'game', 'connected');
        };
        this.socket.onclose = (event) => {
            this.displayMsg('system', 'game', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
            const msg = JSON.parse(await event.data.text());
            if (msg.type === "colorPick") {
                this.setIcons(msg.value.pName, msg.value.pIcon, msg.value.pColor);
                this.displayMsg('player', msg.from, `picked ${msg.value.pColor}`);
            }
            else if (msg.type === "turnTaken") {
                this.whiteTurn = !this.whiteTurn;
                // this.displayMsg('player', msg.from, `${msg.value.color}'s turn`);
            }
            else if (msg.type === "pieceMoved") {
                console.log("here", msg.value);
                let movedPiece = this.getPiece("id" + msg.value.piece.id);
                let movSquare = this.getSquare(msg.value.movSquare);
                movedPiece.movePieceRemote(movSquare);
                this.displayMsg('player', msg.from, `moved ${msg.value.piece.id}`);
            }
        };
        // this.socket.onmessage = async (event) => {
        //     const msg = JSON.parse(await event.data.text());
        //     if (msg.type === GameEndEvent) {
        //         this.displayMsg('player', msg.from, `scored ${msg.value.score}`);
        //     } else if (msg.type === GameStartEvent) {
        //         this.displayMsg('player', msg.from, `started a new game`);
        //     }
        // };

    }

    displayMsg(cls, from, msg) {
        const chatText = document.querySelector('#player-messages');
        chatText.innerHTML =
            `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
    }

    broadcastEvent(from, type, value) {
        const event = {
            from: from,
            type: type,
            value: value,
        };
        this.socket.send(JSON.stringify(event));
    }
}

const game = new Game();

const whiteNameEl = document.querySelector('.playerWName');
const whiteIconEl = document.querySelector('.playerWIcon');
const blackNameEl = document.querySelector('.playerBName');
const blackIconEl = document.querySelector('.playerBIcon');



// whiteNameEl.textContent = this.getPlayerName();
// whiteIconEl.src = "https://robohash.org/" + this.getPlayerIcon() + ".png";

//placeholder for webSocket
// setInterval(() => {
//     // const score = Math.floor(Math.random() * 3000);
//     const chatText = document.querySelector('#player-messages');
//     chatText.innerHTML =
//       `<div class="event"><span class="player-event">somePlayer</span> started a new game</div>` +
//       chatText.innerHTML;
//   }, 5000);
