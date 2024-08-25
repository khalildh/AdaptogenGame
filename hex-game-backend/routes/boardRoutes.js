const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

let currentBoard = null;

// Create a new board
router.post('/create', (req, res) => {
    try {
        // Default values for testing
        const config = {
            dimensions: { width: 11, height: 11 },
        };
        console.log('Creating new board with config:', config);
        currentBoard = new Board(config);
        console.log('Board created:', currentBoard);
        const serializedState = currentBoard.serializeState();
        console.log('Serialized state:', serializedState);
        res.status(200).json(serializedState);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({ error: 'Failed to create board' });
    }
});
// Get current board state
router.get('/state', (req, res) => {
    if (!currentBoard) {
        return res.status(404).json({ error: 'No active board' });
    }
    res.json(currentBoard.serializeState());
});



module.exports = router;