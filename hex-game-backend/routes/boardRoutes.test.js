const request = require('supertest');
const express = require('express');
const boardRoutes = require('./boardRoutes');
const board = require('../models/Board');
const { deserializeState } = require('../models/Player');
const Board = require('../models/Board');
const { parse } = require('uuid');

const app = express();
app.use(express.json());
app.use('/api/board', boardRoutes);

describe('Board Routes', () => {
  // Test creating a new board
  test('POST /api/board/create', async () => {
    const response = await request(app)
      .post('/api/board/create')
      .send();
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('dimensions');
    expect(response.body.dimensions).toEqual({ width: 11, height: 11 });
    expect(response.body).toHaveProperty('grid');
    const dimensions = response.body.dimensions;
    // const parseObj = JSON(response.body)
    // const dimensions = parseObj.dimensions
    const config = {
        dimensions: { width: 1, height: 1 },
    };

    const newBoardObj = new Board(config);
    const deserializedGrid = newBoardObj.deserializeGrid(response.body.grid)

    expect(deserializedGrid.size).toBe(11 * 11)
  });

  // ... existing code ...

  // Test getting board state
  test('GET /api/board/state', async () => {
    // First create a board
    await request(app).post('/api/board/create').send();

    const response = await request(app).get('/api/board/state');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('dimensions');
    expect(response.body.dimensions).toEqual({ width: 11, height: 11 });
    expect(response.body).toHaveProperty('grid');
    
    const newBoardObj = new Board({ dimensions: { width: 11, height: 11 } });
    const deserializedGrid = newBoardObj.deserializeGrid(response.body.grid);

    expect(deserializedGrid.size).toBe(11 * 11);
  });

});