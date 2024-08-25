const { v4: uuidv4 } = require('uuid');
const { Grid, rectangle } = require('honeycomb-grid');
const Game = require('./models/Game');

const games = new Map();

function createNewGame() {
  const gameId = uuidv4();
  const grid = new Grid(Game.Tile, rectangle({ width: 10, height: 10 }));
  
  grid.forEach(hex => {
    hex.terrain = Game.createTerrain();
    hex.owner = null;
  });

  const newGame = new Game(gameId, grid);
  games.set(gameId, newGame);
  return { gameId, game: newGame };
}

function makeMove(game, coordinates, playerId) {
  const hex = game.grid.get(coordinates);
  if (!hex) {
    throw new Error('Invalid coordinates');
  }
  if (hex.owner) {
    throw new Error('Tile already owned');
  }
  
  hex.owner = playerId;
  
  // Here you would add game logic for capturing adjacent tiles, etc.
  
  return game;
}

module.exports = {
  games,
  createNewGame,
  makeMove
};