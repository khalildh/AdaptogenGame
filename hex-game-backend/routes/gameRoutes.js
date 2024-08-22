const express = require('express');
const router = express.Router();
const { createNewGame, games } = require('../gameLogic');

router.post('/new', (req, res) => {
  const { gameId, game } = createNewGame();
  res.json({ gameId, game });
});

module.exports = router;