// Controller = recebe requisição HTTP e responde

const cardsService = require('../services/cardsService');

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

    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar cards do deck' });
  }
}

async function createCard(req, res) {
  try {
    const newCard = await cardsService.createCard(req.body);

    res.status(201).json(newCard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao criar card' });
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

    res.json({ message: 'Card removido com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao remover card' });
  }
}

module.exports = {
  getAllCards,
  getCardsByDeckId,
  createCard,
  updateCard,
  deleteCard,
};