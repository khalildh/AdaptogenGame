const { Server } = require('socket.io');
const Client = require('socket.io-client');
const setupSocketHandlers = require('./socketHandlers');
const http = require('http');
const request = require('request');

const SERVER_URL = 'http://localhost:3001';

describe('Socket Handlers and Game Setup', () => {
  let io, serverSocket, clientSocket, games;

  // Function to create a user
  function createUser(name, color) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: `${SERVER_URL}/api/users`,
        json: { name, color }
      };
      request(options, (error, response, body) => {
        if (error) reject(error);
        else if (response.statusCode !== 200) reject(new Error(`HTTP Status ${response.statusCode}`));
        else resolve(body);
      });
    });
  }

  // Function to create a game
  function createGame(players) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: `${SERVER_URL}/api/game`,
        json: {
          playerConfigs: players.map(player => ({
            id: player.id,
            name: player.name,
            color: player.color
          })),
          boardConfig: { width: 11, height: 11 }
        }
      };
      request(options, (error, response, body) => {
        if (error) reject(error);
        else if (response.statusCode !== 200) reject(new Error(`HTTP Status ${response.statusCode}`));
        else resolve(body);
      });
    });
  }

  beforeAll((done) => {
    const httpServer = http.createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
    games = new Map();
    setupSocketHandlers(io, games);
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  // test('should create players and game', async () => {
  //   const player1 = await createUser('Player1', 'blue');
  //   expect(player1).toBeDefined();
  //   expect(player1.name).toBe('Player1');

  //   const player2 = await createUser('Player2', 'red');
  //   expect(player2).toBeDefined();
  //   expect(player2.name).toBe('Player2');

  //   const game = await createGame([player1, player2]);
  //   expect(game).toBeDefined();
  //   expect(game.gameId).toBeDefined();
  // });


  // ... existing code ...

  test('should handle and broadcast messages', (done) => {
    const testMessage = 'Hello, world!';

    // Set up a second client to verify broadcast
    const clientSocket2 = new Client(`http://localhost:${io.httpServer.address().port}`);

    clientSocket2.on('connect', () => {
      // Listen for the message on both clients
      const messagePromise1 = new Promise((resolve) => clientSocket.on('message', resolve));
      const messagePromise2 = new Promise((resolve) => clientSocket2.on('message', resolve));

      // Emit the message from clientSocket
      clientSocket.emit('message', testMessage);

      // Wait for both clients to receive the message
      Promise.all([messagePromise1, messagePromise2]).then(([message1, message2]) => {
        expect(message1).toBe(testMessage);
        expect(message2).toBe(testMessage);
        clientSocket2.close();
        done();
      });
    });
  });

// ... existing code ...

  // test('should join a game', (done) => {
  //   const gameId = 'testGame';
  //   const mockGame = {
  //     saveGameState: jest.fn().mockReturnValue({ id: gameId, state: 'test' })
  //   };
  //   games.set(gameId, mockGame);

  //   clientSocket.emit('joinGame', gameId);

  //   clientSocket.on('gameStateUpdate', (gameState) => {
  //     expect(gameState).toEqual({ id: gameId, state: 'test' });
  //     expect(mockGame.saveGameState).toHaveBeenCalled();
  //     done();
  //   });
  // });

  // test('should handle makeMove', (done) => {
  //   const gameId = 'testGame';
  //   const mockGame = {
  //     makeMove: jest.fn().mockReturnValue(true),
  //     saveGameState: jest.fn().mockReturnValue({ id: gameId, state: 'moved' })
  //   };
  //   games.set(gameId, mockGame);

  //   clientSocket.emit('makeMove', { gameId, x: 0, y: 0, playerId: 'player1' });

  //   clientSocket.on('gameStateUpdate', (gameState) => {
  //     expect(gameState).toEqual({ id: gameId, state: 'moved' });
  //     expect(mockGame.makeMove).toHaveBeenCalledWith(0, 0, 'player1');
  //     expect(mockGame.saveGameState).toHaveBeenCalled();
  //     done();
    // });
  // });
});