const request = require('supertest');
const express = require('express');
const userRoutes = require('./userRoutes');

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User Routes', () => {
  let playerId;

  test('POST /api/user should create a new player', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({ name: 'TestPlayer', color: 'blue' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('TestPlayer');
    expect(response.body.color).toBe('blue');
    playerId = response.body.id;
  });

  test('GET /api/user/:playerId should get a player by ID', async () => {
    const response = await request(app).get(`/api/user/${playerId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(playerId);
    expect(response.body.name).toBe('TestPlayer');
    expect(response.body.color).toBe('blue');
  });

  test('PUT /api/user/:playerId should update a player', async () => {
    const response = await request(app)
      .put(`/api/user/${playerId}`)
      .send({ name: 'UpdatedPlayer', color: 'red' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(playerId);
    expect(response.body.name).toBe('UpdatedPlayer');
    expect(response.body.color).toBe('red');
  });

  test('GET /api/user should get all players', async () => {
    const response = await request(app).get('/api/user');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('color');
  });

  test('GET /api/user/:playerId should return 404 for non-existent player', async () => {
    const response = await request(app).get('/api/user/non-existent-id');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Player not found');
  });

  test('PUT /api/user/:playerId should return 404 for non-existent player', async () => {
    const response = await request(app)
      .put('/api/user/non-existent-id')
      .send({ name: 'UpdatedPlayer', color: 'red' });
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Player not found');
  });
});