const cardsService = require('../services/cardsService');
const crypto = require('crypto');

async function createCard(req, res) {
  try {
    // Se não houver ID válido, gera um novo
    if (!req.body.id || req.body.id.trim() === '') {
      req.body.id = crypto.randomUUID();
    }

    const newCard = await cardsService.createCard(req.body, req.user.uid);
    if (!newCard) {
      return res.status(404).json({ error: 'Deck não encontrado.' });
    }
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
    const updatedCard = await cardsService.updateCard(id, req.body, req.user.uid);
    if (!updatedCard) {
      return res.status(404).json({ error: 'Card não encontrado.' });
    }
    res.json(updatedCard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar card' });
  }
}

async function deleteCard(req, res) {
  try {
    const { id } = req.params;
    const deleted = await cardsService.deleteCard(id, req.user.uid);
    if (!deleted) {
      return res.status(404).json({ error: 'Card não encontrado.' });
    }
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
    const updatedCard = await cardsService.updateNextReview(id, next_review, req.user.uid);
    if (!updatedCard) {
      return res.status(404).json({ error: 'Card não encontrado.' });
    }
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
    const cards = await cardsService.getAllCards(req.user.uid);
    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar cards' });
  }
}

async function getCardsByDeckId(req, res) {
  try {
    const { deckId } = req.params;
    const cards = await cardsService.getCardsByDeckId(deckId, req.user.uid);
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
