const decksService = require('../services/decksService');

async function getAllDecks(req, res) {
  try {
    const decks = await decksService.getAllDecks(req.user.uid);

    res.json(decks);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro ao buscar decks',
    });
  }
}

async function createDeck(req, res) {
  try {
    const newDeck = await decksService.createDeck(req.body, req.user.uid);

    res.status(201).json(newDeck);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro ao criar deck',
    });
  }
}

async function updateDeck(req, res) {
  try {
    const { id } = req.params;

    const updatedDeck = await decksService.updateDeck(
      id,
      req.body,
      req.user.uid
    );

    if (!updatedDeck) {
      return res.status(404).json({ error: 'Deck não encontrado.' });
    }
    res.json(updatedDeck);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro ao atualizar deck',
    });
  }
}

async function deleteDeck(req, res) {
  try {
    const { id } = req.params;

    const deleted = await decksService.deleteDeck(id, req.user.uid);
    if (!deleted) {
      return res.status(404).json({ error: 'Deck não encontrado.' });
    }

    res.json({
      message: 'Deck removido com sucesso',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro ao remover deck',
    });
  }
}

module.exports = {
  getAllDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};