function setupSocketHandlers(io, games) {
    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('message', (message) => {
        console.log("message recieved, and will emit:", message)
        io.emit('message', message)
      })
  
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

      // socket.on('exportGame', (gameId) => {
      //   console.log(`Exporting game with ID: ${gameId}`);
      //   const game = games.get(gameId);
      //   if (game) {
      //     socket.emit('gameExport', game.saveGameState());
      //   } else {
      //     console.log(`Game not found for export with ID: ${gameId}`);
      //     socket.emit('gameExport', { error: 'Game not found' });
      //   }
      // });
      
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });

    //   socket.on('hexClicked', ({ gameId, hexCoordinates }) => {
    //   console.log(`Hex clicked in game ${gameId}: ${hexCoordinates}`);
    //   const game = games.get(gameId);
    //   if (game) {
    //     // Update game state based on the clicked hex
    //     // This is a placeholder - replace with actual game logic
    //     const updatedState = game.handleHexClick(hexCoordinates);
    //     io.to(gameId).emit('gameStateUpdate', updatedState);
    //   }
    // });


    });
  }
  
  module.exports = setupSocketHandlers;