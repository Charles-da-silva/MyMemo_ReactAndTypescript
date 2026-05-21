const express = require('express');

const router = express.Router();

const decksController = require('../controllers/decksController');

router.get('/', decksController.getAllDecks);

router.post('/', decksController.createDeck);

router.put('/:id', decksController.updateDeck);

router.delete('/:id', decksController.deleteDeck);

module.exports = router;