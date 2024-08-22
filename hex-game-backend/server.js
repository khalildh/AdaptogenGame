const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const { createNewGame, games } = require('./gameLogic');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/game', gameRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Creating initial game...');
  const { gameId, game } = createNewGame();
  console.log(`Initial game created with ID: ${gameId}`);
  console.log(games);
  console.log(`Grid with size: ${game.grid.size}`);
});