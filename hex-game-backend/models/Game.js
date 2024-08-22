const { defineHex } = require('honeycomb-grid');

const terrains = ["Forest", "Mountain", "Plains", "Water", "Desert"];

const Tile = defineHex({ dimensions: 30, origin: 'topLeft' });

function createTerrain() {
  const randomIndex = Math.floor(Math.random() * terrains.length);
  return terrains[randomIndex];
}

class Game {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
    this.players = [];
  }
}

Game.Tile = Tile;
Game.createTerrain = createTerrain;

module.exports = Game;