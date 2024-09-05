import React, { useEffect, useState, useRef } from "react"
import GameBoard from "./GameBoard"

import socketService from "../services/socketService"

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "20px",
  },
  messageBox: {
    flexGrow: 1,
    overflowY: "auto",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    maxHeight: "70vh",
    minHeight: "100px", // Add a minimum height
  },
  message: {
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  },
  inputArea: {
    display: "flex",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(11, 30px)",
    gap: "2px",
    marginBottom: "20px",
  },
  cell: {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}

export const GamePage = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [gameId, setGameId] = useState(null)
  const [grid, setGrid] = useState(null)
  const messageListRef = useRef(null)

  useEffect(() => {
    socketService.on("connect", () => {
      console.log("Connected to WebSocket server")
    })

    socketService.on("disconnect", () => {
      console.log("Disconnected from WebSocket server")
    })

    socketService.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socketService.on("gameStateUpdate", (gameState) => {
      if (gameState.board && gameState.board.grid) {
        setGrid(gameState.board.grid)
      }
    })

    return () => {
      socketService.off("connect")
      socketService.off("disconnect")
      socketService.off("message")
      socketService.off("gameStateUpdate")
    }
  }, [])

  const sendMessage = () => {
    if (inputValue.trim()) {
      socketService.emit("message", inputValue)
      setInputValue("")
    }
  }

  const createNewGame = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerConfigs: [
            { id: "player1", name: "Player 1", color: "blue" },
            { id: "player2", name: "Player 2", color: "red" },
          ],
          boardConfig: { width: 3, height: 3 },
        }),
      })
      const data = await response.json()
      setGameId(data.gameId)
      console.log("New game created:", data)
      setGrid(data.game.board.grid)
      console.log(data.game.board.grid)
    } catch (error) {
      console.error("Error creating new game:", error)
    }
  }

  return (
    <div style={styles.chatContainer}>
      {!gameId ? (
        <div>
          <h2>Create New Game</h2>
          <button onClick={createNewGame} style={styles.button}>
            Create Game
          </button>
        </div>
      ) : (
        <>
          <h2>Game ID: {gameId}</h2>
          <h3> Player 2</h3>
          {grid && <GameBoard grid={grid} gameId={gameId} />}
          <h3> Player 1</h3>
          <div style={styles.messageBox} ref={messageListRef}>
            {messages.map((message, index) => (
              <div key={index} style={styles.message}>
                {message}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )
}
