# 2. Minimal Backend Server

## Technologies:
- [x] Node.js (v14.0.0 or later)
- [x] Express.js (v4.17.1 or later)
- [x] CORS middleware (v2.8.5 or later)
- [x] UUID library (v8.3.2 or later) for generating unique game IDs
- [x] Nodemon (v2.0.7 or later) for development
- [x] Yarn (v1.22.0 or later) for package management

## Steps:

### 1. Set up Node.js project:
- [ ] Create a new directory for the backend: `mkdir hex-game-backend && cd hex-game-backend`
- [x] Initialize a new Node.js project: `yarn init -y`
- [x] Install required dependencies:
  ```
  yarn add express@4.17.1 cors@2.8.5 uuid@8.3.2
  yarn add nodemon@2.0.7 --dev
  ```

### 2. Create Express server:
- [x] Create a new file `server.js` in the project root
- [x] Set up a basic Express server with CORS and JSON parsing middleware
- [x] Configure the server to listen on port 3001

### 3. Implement game session initialization:
- [x] Create a `POST /api/game/new` endpoint in `server.js`
- [x] Use UUID to generate a unique game ID
- [x] Initialize an empty 10x10 hexagonal grid for the new game
- [x] Store the game state in server memory (use a Map or object)
- [x] Return the game ID and initial grid state to the client

### 4. Handle tile coordinate requests:
- [ ] Create a `POST /api/game/:gameId/move` endpoint in `server.js`
- [ ] Validate the incoming gameId, coordinates, and playerId
- [ ] Update the game state based on the move
- [ ] Return the updated grid state to the client

### 5. Test the server:
- [ ] Use Postman or curl to test the `/api/game/new` endpoint
- [ ] Test the `/api/game/:gameId/move` endpoint with various scenarios

## Notes:
- Ensure all endpoints return appropriate HTTP status codes
- Implement basic error handling for robustness
- Keep game logic minimal for the PoC
- Prepare for Socket.IO integration in the next step

Next step: Implement real-time updates using Socket.IO