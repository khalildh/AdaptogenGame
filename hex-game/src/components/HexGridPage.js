import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle } from 'honeycomb-grid'
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

// Function to randomly assign a terrain type to a tile
function createTerrain() {
  const randomIndex = Math.floor(Math.random() * terrains.length);
  return terrains[randomIndex];
}

export const HexGridPage = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);


    useEffect(() => {
        // Initialize PIXI application
        appRef.current = new PIXI.Application({ backgroundAlpha: 0, width: 800, height: 600 });
        appRef.current.view.addEventListener('click', ({ offsetX, offsetY }) => {
            const hex = grid.pointToHex(
              { x: offsetX, y: offsetY },
              { allowOutside: false }
            )

            hex.setTerrain("Forest")

            if (hex) {
                console.log(hex)
                renderHex(hex)
            }
          });


        // Append the PIXI canvas to the container
        if (containerRef.current) {
            containerRef.current.appendChild(appRef.current.view);
        }

        const graphics = new PIXI.Graphics();
        class Tile extends defineHex({ dimensions: 30, origin: 'topLeft' }) {
            constructor(props) {
                super(props);
                this.terrain = createTerrain();
            }

            get prototypeProp() {
              return `this property won't be present in the instance, only in the prototype`
            }

            // New terrain setter method
            setTerrain(newTerrain) {
                if (terrains.includes(newTerrain)) {
                    this.terrain = newTerrain;
                } else {
                    console.warn(`Invalid terrain type: ${newTerrain}`);
                }
            }

            

            // methods always exist in the prototype
            customMethod() {}
          }
        // const Tile = defineHex({ dimensions: 30 });
        const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));

        function renderHex(hex) {
            graphics.beginFill(terrainColors[hex.terrain]);
            graphics.drawShape(new PIXI.Polygon(hex.corners));
            graphics.endFill();
        }

        graphics.lineStyle(1, 0x999999);
        grid.forEach(renderHex);
        appRef.current.stage.addChild(graphics);

        // Cleanup function
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    return <div ref={containerRef} />;
};