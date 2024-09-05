// In-memory storage for active pieces, organized by game
const pieces = new Map();

function addPiece(gameId, pieceId, piece) {
  if (!pieces.has(gameId)) {
    pieces.set(gameId, new Map());
  }
  pieces.get(gameId).set(pieceId, piece);
}

function getPiece(gameId, pieceId) {
  return pieces.get(gameId)?.get(pieceId);
}

function removePiece(gameId, pieceId) {
  pieces.get(gameId)?.delete(pieceId);
}

module.exports = {
  pieces,
  addPiece,
  getPiece,
  removePiece,
};