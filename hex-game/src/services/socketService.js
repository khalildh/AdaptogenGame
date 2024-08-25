import io from "socket.io-client"

let socket

try {
  console.log("trying to connect")
  socket = io("http://localhost:3001")
  console.log("connected")
} catch (error) {
  console.error("Error initializing socket connection:", error)
}

const socketService = {
  socket,

  on: (event, callback) => {
    socket.on(event, callback)
  },

  off: (event, callback) => {
    socket.off(event, callback)
  },

  emit: (event, ...args) => {
    console.log("event:data")
    console.log(event)
    console.log(args)
    socket.emit(event, ...args)
  },

  connect: () => {
    socket.connect()
  },

  disconnect: () => {
    socket.disconnect()
  },
}

export default socketService
