const decksService = require('../services/decksService');

async function getAllDecks(req, res) {
  try {
    const decks = await decksService.getAllDecks();

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
    const newDeck = await decksService.createDeck(req.body);

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
      req.body
    );

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

    await decksService.deleteDeck(id);

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