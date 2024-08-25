const request = require('supertest');
const express = require('express');
const gameRoutes = require('./gameRoutes');

const app = express();
app.use(express.json());
app.use('/api/game', gameRoutes);

describe('Game Routes', () => {
  let gameId;

  test('POST /api/game should create a new game', async () => {
    const response = await request(app)
      .post('/api/game')
      .send({
        playerConfigs: [
          { id: 'player1', name: 'Player 1', color: 'blue' },
          { id: 'player2', name: 'Player 2', color: 'red' }
        ],
        boardConfig: { width: 11, height: 11 }
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('gameId');
    expect(response.body).toHaveProperty('game');
    gameId = response.body.gameId;
  });

  test('GET /api/game should get all active games', async () => {
    const response = await request(app).get('/api/game');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('players');
    expect(response.body[0]).toHaveProperty('board');
  });

  test('GET /api/game/:gameId should get a game by ID', async () => {
    const response = await request(app).get(`/api/game/${gameId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', gameId);
    expect(response.body).toHaveProperty('players');
    expect(response.body).toHaveProperty('board');
  });

  test('GET /api/game/:gameId should return 404 for non-existent game', async () => {
    const response = await request(app).get('/api/game/non-existent-id');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Game not found');
  });

  test('GET /api/game/:gameId/export should export game state', async () => {
    const response = await request(app).get(`/api/game/${gameId}/export`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', gameId);
    expect(response.body).toHaveProperty('players');
    expect(response.body).toHaveProperty('board');
  });

  test('GET /api/game/:gameId/export should return 404 for non-existent game', async () => {
    const response = await request(app).get('/api/game/non-existent-id/export');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Game not found');
  });

  // test('POST /api/game/import should import a game', async () => {
  //   const exportResponse = await request(app).get(`/api/game/${gameId}/export`);
  //   const gameState = exportResponse.body;

  //   const response = await request(app)
  //     .post('/api/game/import')
  //     .send({ gameState });
    
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toHaveProperty('message', 'Game imported successfully');
  //   expect(response.body).toHaveProperty('gameId');
  // });

  // test('POST /api/game/import should return 400 for invalid game state', async () => {
  //   const response = await request(app)
  //     .post('/api/game/import')
  //     .send({ gameState: { invalid: 'state' } });
    
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body).toHaveProperty('error', 'Invalid game state');
  // });
});