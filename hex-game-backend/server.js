const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const gameRoutes = require("./routes/gameRoutes")
const userRoutes = require("./routes/userRoutes")
const boardRoutes = require("./routes/boardRoutes")
const setupSocketHandlers = require("./sockets/socketHandlers")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/game", gameRoutes)
app.use("/api/users", userRoutes)
app.use("/api/board", boardRoutes)

// Get access to the games Map
const games = gameRoutes.games

setupSocketHandlers(io, games)

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
