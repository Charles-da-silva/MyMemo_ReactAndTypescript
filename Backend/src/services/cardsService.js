// Service = camada de regras de negócio

const cardsRepository = require('../repositories/cardsRepository');

async function getAllCards() {
  const cards = await cardsRepository.getAllCards();

  // Converte alternatives de string JSON para array
  return cards.map((card) => ({
    ...card,
    alternatives:
      typeof card.alternatives === 'string'
        ? JSON.parse(card.alternatives)
        : card.alternatives,
  }));
}

async function getCardsByDeckId(deckId) {
  const cards = await cardsRepository.getCardsByDeckId(deckId);

  return cards.map((card) => ({
    ...card,
    alternatives:
      typeof card.alternatives === 'string'
        ? JSON.parse(card.alternatives)
        : card.alternatives,
  }));
}

async function createCard(card) {
  return await cardsRepository.createCard(card);
}

async function updateCard(id, card) {
  return await cardsRepository.updateCard(id, card);
}

async function deleteCard(id) {
  return await cardsRepository.deleteCard(id);
}

async function updateNextReview(id, nextReview) {
  return cardsRepository.updateNextReview(
    id,
    nextReview
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