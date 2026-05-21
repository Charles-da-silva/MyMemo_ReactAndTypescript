const decksRepository = require('../repositories/decksRepository');

async function getAllDecks() {
  return await decksRepository.getAllDecks();
}

async function createDeck(deck) {
  return await decksRepository.createDeck(deck);
}

async function updateDeck(id, deck) {
  return await decksRepository.updateDeck(id, deck);
}

async function deleteDeck(id) {
  return await decksRepository.deleteDeck(id);
}

module.exports = {
  getAllDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};