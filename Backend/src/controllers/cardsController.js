// Controller = recebe requisição HTTP e responde

const cardsService = require('../services/cardsService');

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
    console.log('Cards retornados:', cards.length, 'cards');
    console.log('Primeiros cards (next_review):', cards.slice(0, 3).map(c => ({
      id: c.id,
      question: c.question.substring(0, 30),
      next_review: c.next_review
    })));

    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar cards do deck' });
  }
}

async function createCard(req, res) {
  try {
    const newCard = await cardsService.createCard(req.body, req.user.uid);
    if (!newCard) {
      return res.status(404).json({ error: 'Deck não encontrado.' });
    }
    res.status(201).json(newCard);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : String(error);
    res.status(500).send(`Card create error: ${stack}`);
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

    const updatedCard =
      await cardsService.updateNextReview(
        id,
        next_review,
        req.user.uid
      );

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

module.exports = {
  getAllCards,
  getCardsByDeckId,
  createCard,
  updateCard,
  deleteCard,
  updateNextReview,
};