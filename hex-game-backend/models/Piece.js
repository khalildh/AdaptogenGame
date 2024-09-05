const { addPiece } = require("../store/pieceStore")

class Piece {
    constructor(id, playerId, gameId, boardId, position, attributes = {}) {
        this.id = id;
        this.playerId = playerId;
        this.gameId = gameId;
        this.boardId = boardId;
        
        this.position = position;
        this.isOnBoard = true;
        this.isDestroyed = false;

      // Default attributes
      const defaultAttributes = {
        movementRange: 1,
        attackRange: 1,
      };
  
      // Merge default attributes with provided attributes
      this.setAttributes({ ...defaultAttributes, ...attributes });

      addPiece(this.gameId, this.id, this);
    }
  
    setAttributes(attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  
  
    serializeState() {
        const state = {
          id: this.id,
          playerId: this.playerId,
          gameId: this.gameId,
          boardId: this.boardId,
          position: this.position,
          isOnBoard: this.isOnBoard,
          isDestroyed: this.isDestroyed,
        };
      
        // Add all other attributes to the serialized state
        Object.keys(this).forEach(key => {
          if (!state.hasOwnProperty(key) && typeof this[key] !== 'function') {
            state[key] = this[key];
          }
        });
      
        return state;
      }
    
  
    static deserializeState(state, players) {
      const player = players.find(p => p.id === state.player);
      const { position, ...attributes } = state;
      const piece = new Piece(player, position, attributes);
      return piece;
    }
  }
  
  module.exports = Piece;