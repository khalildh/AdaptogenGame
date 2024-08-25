const express = require('express');
const router = express.Router();
const playerStore = require('../store/playerStore');

// Create a new player
router.post('/', (req, res) => {
  const { name, color } = req.body;
  const player = playerStore.create(name, color);
  res.json(player.serializeState());
});

// Get a player by ID
router.get('/:playerId', (req, res) => {
  const { playerId } = req.params;
  const player = playerStore.get(playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player.serializeState());
});

// Update a player
router.put('/:playerId', (req, res) => {
  const { playerId } = req.params;
  const { name, color } = req.body;
  const player = playerStore.update(playerId, { name, color });
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player.serializeState());
});

// Get all players
router.get('/', (req, res) => {
  const players = playerStore.getAll();
  res.json(players.map(player => player.serializeState()));
});

module.exports = router;