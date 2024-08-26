const Board = require("./Board")
const Player = require("./Player")

class Game {
  constructor(id, config) {
    config = {
      id: config.id,
      dimensions: {
        width: config.width,
        height: config.height,
      },
    }
    this.id = id
    this.board = new Board(config)
    this.players = []
    this.currentPlayerTurn = null
    this.gameStatus = "initialized"
    this.history = []
  }

  initializeGame(playerConfigs) {
    this.players = playerConfigs.map(
      (config) => new Player(config.id, config.name, config.color)
    )
    this.startGame()
  }

  startGame() {
    this.gameStatus = "in_progress"
    this.currentPlayerTurn = this.players[0]
  }

  endGame() {
    this.gameStatus = "ended"
  }

  switchTurn() {
    const currentIndex = this.players.indexOf(this.currentPlayerTurn)
    this.currentPlayerTurn =
      this.players[(currentIndex + 1) % this.players.length]
  }

  checkWinCondition() {
    // Implement win condition logic
  }

  addToHistory(event) {
    this.history.push(event)
  }

  getGameHistory() {
    return this.history
  }

  addPiece(player, position) {
    if (this.board.addPiece(player, position) && player.canAddPiece()) {
      player.addPiece()
      this.addToHistory({ type: "add_piece", player: player.id, position })
      return true
    }
    return false
  }

  movePiece(player, fromPosition, toPosition) {
    if (this.board.movePiece(fromPosition, toPosition)) {
      this.addToHistory({
        type: "move_piece",
        player: player.id,
        from: fromPosition,
        to: toPosition,
      })
      return true
    }
    return false
  }

  removePiece(player, position) {
    if (this.board.removePiece(position)) {
      player.removePiece()
      this.addToHistory({ type: "remove_piece", player: player.id, position })
      return true
    }
    return false
  }

  isGameOver() {
    return this.gameStatus === "ended"
  }

  saveGameState() {
    return {
      id: this.id,
      board: this.board.serializeState(),
      players: this.players.map((player) => player.serializeState()),
      currentPlayerTurn: this.currentPlayerTurn
        ? this.currentPlayerTurn.id
        : null,
      gameStatus: this.gameStatus,
      history: this.history,
    }
  }

  // loadGameState(savedState) {
  //   const game = new Game(savedState.id, { width: savedState.board.width, height: savedState.board.height });
  //   game.initializeGame(savedState.players);

  //   game.board = Board.deserializeState(savedState.board);
  //   game.players = savedState.players.map(Player.deserializeState);
  //   game.currentPlayerTurn = game.players.find(player => player.id === savedState.currentPlayerTurn);
  //   game.gameStatus = savedState.gameStatus;
  //   game.history = savedState.history;
  //   return game;
  // }
}

module.exports = Game
