const { defineHex, rectangle, Grid } = require('honeycomb-grid');

const terrains = ["Forest", "Mountain", "Plains", "Water", "Desert"];

const Tile = defineHex({ dimensions: 50, origin: 'topLeft' });

function createTerrain() {
  const randomIndex = Math.floor(Math.random() * terrains.length);
  return terrains[randomIndex];
}

class Board {
  constructor(config) {
    this.dimensions = config.dimensions;
    this.grid = new Grid(Tile, rectangle({ width: this.dimensions.width, height: this.dimensions.height }));
  }

  resetBoard() {
    this.grid.forEach(hex => {
      hex.occupiedBy = null;
    });
  }

  updateBoard(position, player) {
    const hex = this.grid.get(position);
    if (hex) {
      hex.occupiedBy = player;
    }
  }

  addPiece(player, position) {
    if (this.isValidPosition(position) && !this.isPieceAt(position)) {
      this.updateBoard(position, player);
      return true;
    }
    return false;
  }

  movePiece(fromPosition, toPosition) {
    const fromHex = this.grid.get(fromPosition);
    const toHex = this.grid.get(toPosition);

    if (fromHex && toHex && fromHex.occupiedBy && !toHex.occupiedBy) {
      toHex.occupiedBy = fromHex.occupiedBy;
      fromHex.occupiedBy = null;
      return true;
    }
    return false;
  }

  removePiece(position) {
    const hex = this.grid.get(position);
    if (hex && hex.occupiedBy) {
      hex.occupiedBy = null;
      return true;
    }
    return false;
  }

  getAdjacentHexes(position) {
    return this.grid.neighborsOf(this.grid.get(position));
  }

  isValidMove(fromPosition, toPosition) {
    const fromHex = this.grid.get(fromPosition);
    const toHex = this.grid.get(toPosition);
    const adjacentHexes = this.getAdjacentHexes(fromPosition);

    return fromHex && toHex && fromHex.occupiedBy && !toHex.occupiedBy && adjacentHexes.includes(toHex);
  }

  isStartingPosition(position, player) {
    return this.startingPositions[player.id].some(startPos => startPos.equals(position));
  }

  getAllOccupiedPositions() {
    return this.grid.filter(hex => hex.occupiedBy !== null);
  }

  setStartingPositions(players) {
    // Implement logic to set starting positions for each player
    // This is a placeholder and should be adjusted based on your game rules
    const startingPositions = {};
    players.forEach((player, index) => {
      startingPositions[player.id] = [this.grid.get([0, index])];
    });
    return startingPositions;
  }

  isValidPosition(position) {
    return this.grid.includes(position);
  }

  isPieceAt(position) {
    const hex = this.grid.get(position);
    return hex && hex.occupiedBy !== null;
  }

  serializeState() {
    return {
      dimensions: this.dimensions,
      grid: JSON.stringify(this.grid),
    };
  }
  deserializeGrid(serializedGrid) {
    const deserializedGrid = JSON.parse(serializedGrid);
    const grid2 = Grid.fromJSON(deserializedGrid)
    return grid2
  }
}

module.exports = Board;