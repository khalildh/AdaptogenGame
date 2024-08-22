import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle } from 'honeycomb-grid'
import * as PIXI from 'pixi.js';

export const HexGridPage = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        // Initialize PIXI application
        appRef.current = new PIXI.Application({ backgroundAlpha: 0, width: 800, height: 600 });
        
        // Append the PIXI canvas to the container
        if (containerRef.current) {
            containerRef.current.appendChild(appRef.current.view);
        }

        const graphics = new PIXI.Graphics();
        const Tile = defineHex({ dimensions: 30 });
        const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));

        function renderHex(hex) {
            graphics.drawShape(new PIXI.Polygon(hex.corners));
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