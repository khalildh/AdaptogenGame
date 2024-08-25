const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for active games
const games = new Map();

router.post('/', (req, res) => {
  try {
    console.log('Creating new game with request body:', req.body);
    const { playerConfigs, boardConfig } = req.body;
    const gameId = uuidv4();
    const game = new Game(gameId, { width: boardConfig.width, height: boardConfig.height });
    game.initializeGame(playerConfigs);
    games.set(gameId, game);
    console.log(`Game created with ID: ${gameId}`);
    res.status(200).json({ gameId, game: game.saveGameState() });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/', (req, res) => {
  console.log('Fetching all active games');
  const activeGames = Array.from(games.values())
    .filter(game => game.gameStatus === 'in_progress')
    .map(game => game.saveGameState());
  console.log(`Found ${activeGames.length} active games`);
  res.json(activeGames);
});

router.get('/:gameId', (req, res) => {
  const { gameId } = req.params;
  console.log(`Fetching game with ID: ${gameId}`);
  const game = games.get(gameId);
  if (!game) {
    console.log(`Game not found with ID: ${gameId}`);
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game.saveGameState());
});

router.get('/:gameId/export', (req, res) => {
  const { gameId } = req.params;
  console.log(`Exporting game with ID: ${gameId}`);
  const game = games.get(gameId);
  if (!game) {
    console.log(`Game not found for export with ID: ${gameId}`);
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game.saveGameState());
});

// router.post('/import', (req, res) => {
//   console.log('Importing game with request body:', req.body);
//   const { gameState } = req.body;
//   const game = Game.loadGameState(gameState);
//   games.set(game.id, game);
//   console.log(`Game imported successfully with ID: ${game.id}`);
//   res.json({ message: 'Game imported successfully', gameId: game.id });
// });

module.exports = router;