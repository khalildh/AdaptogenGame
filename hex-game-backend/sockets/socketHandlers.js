function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New client connected")

    socket.on("message", (message) => {
      console.log("message recieved, and will emit:", message)
      io.emit("message", message)
    })

    socket.on("message2", (message2) => {
      console.log("message2 recieved, and will emit:", message2)
      io.emit("message2", message2)
    })

    socket.on("hexClicked", (arg1, arg2) => {
      console.log(`Server received hexClicked event arg1: ${arg1}`)
      console.log(`Server received hexClicked event arg2: ${arg2}`)
      // let parseHex = JSON.parse(arg2)
      // console.log(parseHex)
      // io.emit("hexClicked", hexId) // Broadcast to all clients
      // io.emit("message", `Hex clicked: ${hexId}`) // Keep the existing message emission
    })

    socket.on("joinGame", (gameId) => {
      socket.join(gameId)
      console.log(`Client joined game: ${gameId}`)
      const game = games.get(gameId)
      if (game) {
        io.to(gameId).emit("gameStateUpdate", game.saveGameState())
      }
    })

    socket.on("makeMove", ({ gameId, x, y, playerId }) => {
      const game = games.get(gameId)
      if (game) {
        // Update game state (implement your game logic here)
        // This is a placeholder - replace with actual game logic
        if (game.makeMove(x, y, playerId)) {
          io.to(gameId).emit("gameStateUpdate", game.saveGameState())
        }
      }
    })

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

    socket.on("disconnect", () => {
      console.log("Client disconnected")
    })
  })
}

module.exports = setupSocketHandlers
