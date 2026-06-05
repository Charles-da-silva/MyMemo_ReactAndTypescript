const express = require('express');
const router = express.Router();

const cardsController = require('../controllers/cardsControllerV2');

router.get('/', cardsController.getAllCards);
router.get('/:deckId', cardsController.getCardsByDeckId);

router.post('/', (req, res, next) => {
  console.error('POST /cards called with:', req.body);
  cardsController.createCard(req, res);
});

router.put('/:id', cardsController.updateCard);
router.delete('/:id', cardsController.deleteCard);
router.patch('/:id/review', cardsController.updateNextReview);

module.exports = router;