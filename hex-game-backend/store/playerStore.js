const Player = require('../models/Player');
const { v4: uuidv4 } = require('uuid');

class PlayerStore {
  constructor() {
    this.players = {};
  }

  create(name, color) {
    const id = uuidv4();
    const player = new Player(id, name, color);
    this.players[id] = player;
    return player;
  }

  get(id) {
    return this.players[id];
  }

  update(id, data) {
    const player = this.players[id];
    if (player) {
      Object.assign(player, data);
    }
    return player;
  }

  getAll() {
    return Object.values(this.players);
  }
}

module.exports = new PlayerStore();