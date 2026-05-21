const express = require('express');
const router = express.Router();

const cardsController = require('../controllers/cardsController');

router.get('/', cardsController.getAllCards);
router.get('/deck/:deckId', cardsController.getCardsByDeckId);
router.post('/', cardsController.createCard);
router.put('/:id', cardsController.updateCard);
router.delete('/:id', cardsController.deleteCard);

module.exports = router;