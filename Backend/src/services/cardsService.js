// Service = camada de regras de negócio

const cardsRepository = require('../repositories/cardsRepository');

async function getAllCards(userId) {
  const cards = await cardsRepository.getAllCards(userId);

  // Converte alternatives de string JSON para array
  return cards.map((card) => ({
    ...card,
    alternatives:
      typeof card.alternatives === 'string'
        ? JSON.parse(card.alternatives)
        : card.alternatives,
  }));
}

async function getCardsByDeckId(deckId, userId) {
  const cards = await cardsRepository.getCardsByDeckId(deckId, userId);

  return cards.map((card) => ({
    ...card,
    alternatives:
      typeof card.alternatives === 'string'
        ? JSON.parse(card.alternatives)
        : card.alternatives,
  }));
}

async function createCard(card, userId) {
  return await cardsRepository.createCard(card, userId);
}

async function updateCard(id, card, userId) {
  return await cardsRepository.updateCard(id, card, userId);
}

async function deleteCard(id, userId) {
  return await cardsRepository.deleteCard(id, userId);
}

async function updateNextReview(id, nextReview, userId) {
  return cardsRepository.updateNextReview(
    id,
    nextReview,
    userId
  );
}

module.exports = {
  getAllCards,
  getCardsByDeckId,
  createCard,
  updateCard,
  deleteCard,
  updateNextReview,
};