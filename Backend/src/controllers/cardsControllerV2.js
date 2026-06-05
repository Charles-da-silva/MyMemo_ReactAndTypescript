const cardsService = require('../services/cardsService');
const crypto = require('crypto');

async function createCard(req, res) {
  try {
    // Se não houver ID válido, gera um novo
    if (!req.body.id || req.body.id.trim() === '') {
      req.body.id = crypto.randomUUID();
    }

    const newCard = await cardsService.createCard(req.body);
    res.status(201).json(newCard);
  } catch (error) {
    console.error('CARD CREATE ERROR:', error.message);
    res.status(500).json({
      error: 'Erro ao criar card',
      message: error.message
    });
  }
}

async function updateCard(req, res) {
  try {
    const { id } = req.params;
    const updatedCard = await cardsService.updateCard(id, req.body);
    res.json(updatedCard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar card' });
  }
}

async function deleteCard(req, res) {
  try {
    const { id } = req.params;
    await cardsService.deleteCard(id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao remover card' });
  }
}

async function updateNextReview(req, res) {
  try {
    const { id } = req.params;
    const { next_review } = req.body;
    const updatedCard = await cardsService.updateNextReview(id, next_review);
    res.json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao atualizar revisão'
    });
  }
}

async function getAllCards(req, res) {
  try {
    const cards = await cardsService.getAllCards();
    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar cards' });
  }
}

async function getCardsByDeckId(req, res) {
  try {
    const { deckId } = req.params;
    const cards = await cardsService.getCardsByDeckId(deckId);
    console.log('deckId recebido:', deckId);
    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar cards do deck' });
  }
}

module.exports = {
  getAllCards,
  getCardsByDeckId,
  createCard,
  updateCard,
  deleteCard,
  updateNextReview,
};
