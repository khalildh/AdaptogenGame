import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const GameContainer = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        // Initialize PIXI application
        appRef.current = new PIXI.Application();
        appRef.current.init({ width: 640, height: 360 });

        // Append the PIXI canvas to the container
        if (containerRef.current) {
            containerRef.current.appendChild(appRef.current.view);
        }

        // Cleanup function
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    return <div ref={containerRef} />;
};

export default GameContainer;