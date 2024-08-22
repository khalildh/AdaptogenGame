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

module.exports = {
  games,
  createNewGame
};