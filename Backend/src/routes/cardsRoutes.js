const express = require('express');
const router = express.Router();

const cardsController = require('../controllers/cardsController');

router.get('/', cardsController.getAllCards);
router.get('/:deckId', cardsController.getCardsByDeckId);
router.post('/', cardsController.createCard);
router.put('/:id', cardsController.updateCard);
router.delete('/:id', cardsController.deleteCard);
router.patch('/:id/review', cardsController.updateNextReview);

module.exports = router;