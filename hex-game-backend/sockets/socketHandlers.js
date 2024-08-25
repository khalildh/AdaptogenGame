function setupSocketHandlers(io, games) {
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Client joined game: ${gameId}`);
        const game = games.get(gameId);
        if (game) {
          io.to(gameId).emit('gameStateUpdate', game.saveGameState());
        }
      });
  
      socket.on('makeMove', ({ gameId, x, y, playerId }) => {
        const game = games.get(gameId);
        if (game) {
          // Update game state (implement your game logic here)
          // This is a placeholder - replace with actual game logic
          if (game.makeMove(x, y, playerId)) {
            io.to(gameId).emit('gameStateUpdate', game.saveGameState());
          }
        }
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  
  module.exports = setupSocketHandlers;