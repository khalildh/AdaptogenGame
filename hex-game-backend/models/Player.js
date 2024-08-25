class Player {
    constructor(id, name, color) {
      this.id = id;
      this.name = name;
      this.color = color;
    //   this.piecesOnBoard = 0;
    //   this.reservePieces = 9;
    }
  
    getAvailableMoves(game, piece) {
      // This method will be implemented later to calculate available moves
      // based on the current game state and the specific piece
    }
  
    canAddPiece() {
      return this.piecesOnBoard < 10;
    }
  
    addPiece() {
      if (this.canAddPiece()) {
        this.piecesOnBoard++;
        this.reservePieces--;
      }
    }
  
    removePiece() {
      if (this.piecesOnBoard > 0) {
        this.piecesOnBoard--;
      }
    }
  
    serializeState() {
      return {
        id: this.id,
        name: this.name,
        color: this.color,
        // piecesOnBoard: this.piecesOnBoard,
        // reservePieces: this.reservePieces
      };
    }
  
    static deserializeState(state) {
      const player = new Player(state.id, state.name, state.color);
    //   player.piecesOnBoard = state.piecesOnBoard;
    //   player.reservePieces = state.reservePieces;
      return player;
    }
  }
  
  module.exports = Player;