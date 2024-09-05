import React, { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"
import { hexToPoint, Grid, defineHex, Hex } from "honeycomb-grid"
import socketService from "../services/socketService"

class CustomHex extends defineHex({ dimensions: 80, origin: "topLeft" }) {
  static create(coordinates, custom) {
    const hex = new CustomHex(coordinates)
    hex.terrain = custom
    return hex
  }
}

const terrainColors = {
  Forest: 0x228b22, // Forest Green
  Mountain: 0x808080, // Gray
  Plains: 0x90ee90, // Light Green
  Water: 0x1e90ff, // Dodger Blue
  Desert: 0xf4a460, // Sandy Brown
}

const horizontalOffset = 0
const verticalOffset = 0

const GameBoard = ({ grid, gameId }) => {
  grid = JSON.parse(grid)
  //   grid = Grid.fromJSON(grid)
  grid = Grid.fromJSON(grid, ({ q, r, terrain }) =>
    CustomHex.create([q, r], terrain)
  )

  console.log(grid.toArray())
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const hexTextRefs = useRef({})

  useEffect(() => {
    // Initialize PIXI application
    appRef.current = new PIXI.Application({
      backgroundAlpha: 0,
      width: 500,
      height: 404,
    })
    appRef.current.view.addEventListener("click", handleMouseclick)

    function handleMouseclick({ offsetX, offsetY }) {
      const hex = grid.pointToHex(
        { x: offsetX - horizontalOffset, y: offsetY - verticalOffset },
        { allowOutside: false }
      )

      if (hex) {
        console.log(hex)
        // Emit a message before sending the hexClicked event
        socketService.emit("message", `Clicked on hex: ${hex.toString()}`)
        // socketService.emit("message2", `2Clicked on hex: ${hex.toString()}`)
        // Use socketService to emit the hexClicked event
        socketService.emit("hexClicked", gameId, hex.q, hex.r, hex.terrain)
      }
    }

    // Append the PIXI canvas to the container
    if (containerRef.current) {
      containerRef.current.appendChild(appRef.current.view)
    }

    const graphics = new PIXI.Graphics()
    appRef.current.stage.addChild(graphics)

    function renderHex(hex) {
      //   console.log("renderhex", hex.terrain)
      const corners = hex.corners.map((corner) => ({
        x: corner.x + horizontalOffset,
        y: corner.y + verticalOffset,
      }))

      graphics.beginFill(terrainColors[hex.terrain])
      graphics.drawShape(new PIXI.Polygon(corners))
      graphics.endFill()

      // Remove existing text if it exists
      if (hexTextRefs.current[hex.toString()]) {
        appRef.current.stage.removeChild(hexTextRefs.current[hex.toString()])
      }

      // Add text to the center of the hex
      const hexPoint = hexToPoint(hex)
      const text = new PIXI.Text(`${hex}`, {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0x000000,
        align: "center",
      })
      text.anchor.set(0.5)
      text.position.set(
        hexPoint.x + horizontalOffset,
        hexPoint.y + verticalOffset
      )
      appRef.current.stage.addChild(text)
      hexTextRefs.current[hex.toString()] = text
    }

    graphics.lineStyle(1, 0x999999)
    grid.forEach(renderHex)

    // Add socket listener for hexUpdated event
    socketService.on("hexchanged", (gameId, q, r, newTerrain) => {
      console.log("hexchanged", gameId, q, r, newTerrain)
      const updatedHex = grid.getHex([q, r])
      if (updatedHex) {
        updatedHex.terrain = newTerrain
        renderHex(updatedHex)
      }
    })

    // Cleanup function
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true)
      }
    }
  }, [])

  return <div ref={containerRef} />
}

export default GameBoard
