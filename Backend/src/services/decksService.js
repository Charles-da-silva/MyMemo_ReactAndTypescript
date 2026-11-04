const decksRepository = require('../repositories/decksRepository');

async function getAllDecks(userId) {
  return await decksRepository.getAllDecks(userId);
}

async function createDeck(deck, userId) {
  return await decksRepository.createDeck(deck, userId);
}

async function updateDeck(id, deck, userId) {
  return await decksRepository.updateDeck(id, deck, userId);
}

async function deleteDeck(id, userId) {
  return await decksRepository.deleteDeck(id, userId);
}

module.exports = {
  getAllDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};