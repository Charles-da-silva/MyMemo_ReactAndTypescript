const decksRepository = require('../repositories/decksRepository');
const cardsRepository = require('../repositories/cardsRepository');

async function validateAndImportDecksCards(jsonData) {
  const errors = [];
  let deckCount = 0;
  let cardCount = 0;

  try {
    if (!jsonData.version) {
      throw new Error('Campo "version" ausente no JSON');
    }

    if (!jsonData.decks || !Array.isArray(jsonData.decks) || jsonData.decks.length === 0) {
      throw new Error('JSON deve conter array "decks" não vazio');
    }

    if (!jsonData.cards || !Array.isArray(jsonData.cards) || jsonData.cards.length === 0) {
      throw new Error('JSON deve conter array "cards" não vazio');
    }

    // Validar cada deck
    for (const deck of jsonData.decks) {
      if (!deck.id || !deck.name) {
        throw new Error('Deck deve ter "id" e "name"');
      }
    }

    // Validar cada card
    for (let i = 0; i < jsonData.cards.length; i++) {
      const card = jsonData.cards[i];

      if (!card.question) {
        throw new Error(`Card ${i}: campo "question" ausente`);
      }
      if (!card.correct_answer) {
        throw new Error(`Card ${i}: campo "correct_answer" ausente`);
      }
      if (!Array.isArray(card.alternatives) || card.alternatives.length !== 5) {
        throw new Error(`Card ${i}: deve ter exatamente 5 alternativas`);
      }
      if (!card.alternatives.includes(card.correct_answer)) {
        throw new Error(`Card ${i}: "correct_answer" não está em "alternatives"`);
      }
      if (!card.deck_id) {
        throw new Error(`Card ${i}: campo "deck_id" ausente`);
      }
    }

    // Importar decks
    for (const deck of jsonData.decks) {
      try {
        await decksRepository.createDeck(deck);
        deckCount++;
      } catch (error) {
        errors.push(`Erro ao criar deck "${deck.name}": ${error.message}`);
      }
    }

    // Importar cards
    for (const card of jsonData.cards) {
      try {
        await cardsRepository.createCard(card);
        cardCount++;
      } catch (error) {
        errors.push(`Erro ao criar card "${card.question}": ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      deckCount,
      cardCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      deckCount: 0,
      cardCount: 0,
      errors: [error.message],
    };
  }
}

module.exports = {
  validateAndImportDecksCards,
};
