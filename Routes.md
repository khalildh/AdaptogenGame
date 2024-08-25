# Game API Routes

## User Management (In-Memory)
- [ ] Create User: `POST /users`
   - Creates a new user in memory
   - Request body should include username and any other initial user data
   - Returns the created user object with a generated userId
- [ ] Get User: `GET /users/{userId}`
   - Retrieves user information for the specified userId
- [ ] Update User: `PUT /users/{userId}`
   - Updates user information for the specified userId
   - Request body should include fields to be updated

## Game Management
- [ ] Create Game: `POST /games`
   - Creates a new game
   - Request body should include player userIds
- [ ] Get Active Games: `GET /games`
   - Lists all active games
- [ ] Get Game Details: `GET /games/{gameId}`
   - Retrieves details for a specific game

## Game State Management
- [ ] Export Game: `GET /games/{gameId}/export`
   - Exports the current state of a game
- [ ] Import Game: `POST /games/import`
   - Imports a previously exported game state

## Basic Statistics
- [ ] Get User Stats: `GET /users/{userId}/stats`
   - Retrieves basic stats for a user (e.g., games played, won, lost)