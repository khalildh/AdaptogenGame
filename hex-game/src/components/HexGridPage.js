import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle, spiral, hexToPoint } from 'honeycomb-grid'
import * as PIXI from 'pixi.js';

// Define possible terrain types as an array of strings
const terrains = ["Forest", "Mountain", "Plains", "Water", "Desert"];

// Define colors for each terrain type
const terrainColors = {
    "Forest": 0x228B22,  // Forest Green
    "Mountain": 0x808080, // Gray
    "Plains": 0x90EE90,  // Light Green
    "Water": 0x1E90FF,   // Dodger Blue
    "Desert": 0xF4A460   // Sandy Brown
};

const horizontalOffset = 500; // Adjust this value to shift more or less
const verticalOffset = 300

// Function to randomly assign a terrain type to a tile
function createTerrain() {
  const randomIndex = Math.floor(Math.random() * terrains.length);
  return terrains[randomIndex];
}

export const HexGridPage = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const hexTextRefs = useRef({}); // New ref to store text objects


    useEffect(() => {
        // Initialize PIXI application
        appRef.current = new PIXI.Application({ backgroundAlpha: 0, width: 1000, height: 1000 });
        appRef.current.view.addEventListener('click', ({ offsetX, offsetY }) => {
            const hex = grid.pointToHex(
                { x: offsetX - horizontalOffset, y: offsetY - verticalOffset},
                { allowOutside: false }
            )

            if (hex) {
                console.log(hex)
                hex.setTerrain("Forest")
                renderHex(hex)
            }
          });

          let lastHoveredHex = null;

        // Add mousemove and mouseout event listeners
        appRef.current.view.addEventListener('mousemove', handleMouseMove);
        // appRef.current.view.addEventListener('mouseout', handleMouseOut);

        function handleMouseMove({ offsetX, offsetY }) {
            const hex = grid.pointToHex(
                { x: offsetX - horizontalOffset, y: offsetY - verticalOffset },
                { allowOutside: false }
            );

            if (hex && hex !== lastHoveredHex) {
                console.log(hex)
                lastHoveredHex = hex;

            }    

        }


        // Append the PIXI canvas to the container
        if (containerRef.current) {
            containerRef.current.appendChild(appRef.current.view);
        }

        const graphics = new PIXI.Graphics();
        class Tile extends defineHex({ dimensions: 40, origin: 'topLeft' }) {
            constructor(props) {
                super(props);
                this.terrain = createTerrain();
            }

            // get prototypeProp() {
            //   return `this property won't be present in the instance, only in the prototype`
            // }

            // New terrain setter method
            setTerrain(newTerrain) {
                if (terrains.includes(newTerrain)) {
                    this.terrain = newTerrain;
                } else {
                    console.warn(`Invalid terrain type: ${newTerrain}`);
                }
            }

            

            // methods always exist in the prototype
            // customMethod() {}
          }
        // const Tile = defineHex({ dimensions: 30 });
        // const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));
        const grid = new Grid(Tile, spiral({ radius: 5 }))

        function renderHex(hex) {
            const corners = hex.corners.map(corner => ({
                x: corner.x + horizontalOffset,
                y: corner.y + verticalOffset
            }));

            console.log("center", hex.center)

            console.log(corners)
            console.log("hexToPoint", hexToPoint(hex));
            const hexPoint = hexToPoint(hex);
            graphics.beginFill(terrainColors[hex.terrain]);
            // graphics.drawShape(new PIXI.Polygon(hex.corners));
            graphics.drawShape(new PIXI.Polygon(corners));

            graphics.endFill();

            // Remove existing text if it exists
            if (hexTextRefs.current[hex.toString()]) {
                appRef.current.stage.removeChild(hexTextRefs.current[hex.toString()]);
            }

            // Add text to the center of the hex
    const text = new PIXI.Text(`${hex.terrain} \n ${hex}`, {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 0x000000,
        align: 'center'
    });
    text.anchor.set(0.5);
    text.position.set(hexPoint.x + horizontalOffset, hexPoint.y + verticalOffset);
    appRef.current.stage.addChild(text);
    hexTextRefs.current[hex.toString()] = text;

        }

        graphics.lineStyle(1, 0x999999);
        appRef.current.stage.addChild(graphics);
        grid.forEach(renderHex);

        // Cleanup function
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    return <div ref={containerRef} />;
};