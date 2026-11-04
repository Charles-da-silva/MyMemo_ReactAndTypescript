const pool = require("../database/connection");

/*
|--------------------------------------------------------------------------
| Buscar todos os cards
|--------------------------------------------------------------------------
*/

async function getAllCards(userId) {

  const result = await pool.query(`
    SELECT cards.*
    FROM cards
    JOIN decks ON decks.id = cards.deck_id
    WHERE decks.owner_id = $1
    ORDER BY cards.question ASC
  `, [userId]);

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Buscar cards por deck
|--------------------------------------------------------------------------
*/

async function getCardsByDeckId(deckId, userId) {

  console.log('Buscando cards do deck:', deckId);

  const result = await pool.query(
    `
      SELECT cards.*
      FROM cards
      JOIN decks ON decks.id = cards.deck_id
      WHERE cards.deck_id = $1 AND decks.owner_id = $2
      ORDER BY cards.question ASC
    `,
    [deckId, userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Criar novo card
|--------------------------------------------------------------------------
*/

async function createCard(card, userId) {

  const crypto = require('crypto');

  console.log('createCard chamado. next_review recebido:', card.next_review);

  const query = `
    INSERT INTO cards (
      id,
      deck_id,
      question,
      correct_answer,
      next_review,
      alternatives,
      image,
      created_at
    )
    SELECT $1, decks.id, $3, $4, $5, $6, $7, $8
    FROM decks
    WHERE decks.id = $2 AND decks.owner_id = $9
    RETURNING cards.*
  `;

  // Generate ID if empty or missing
  const cardId = !card.id || card.id.trim() === '' ? crypto.randomUUID() : card.id;

  const finalNextReview = card.next_review || new Date().toISOString();
  console.log('next_review final:', finalNextReview);

  const values = [
    cardId,
    card.deck_id,
    card.question,
    card.correct_answer,
    finalNextReview,
    card.alternatives || [],
    card.image || null,
    card.created_at || new Date().toISOString(),
    userId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Atualizar card
|--------------------------------------------------------------------------
*/

async function updateCard(id, card, userId) {

  const query = `
    UPDATE cards
    SET
      question = $1,
      correct_answer = $2,
      alternatives = $3,
      next_review = $4,
      image = $5
    WHERE id = $6
      AND EXISTS (
        SELECT 1 FROM decks
        WHERE decks.id = cards.deck_id AND decks.owner_id = $7
      )
    RETURNING *
  `;

  const values = [
    card.question,
    card.correct_answer,
    card.alternatives || [],
    card.next_review,
    card.image,
    id,
    userId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Excluir card
|--------------------------------------------------------------------------
*/

async function deleteCard(id, userId) {

  const result = await pool.query(
    `DELETE FROM cards
     USING decks
     WHERE cards.deck_id = decks.id
       AND cards.id = $1
       AND decks.owner_id = $2
     RETURNING cards.id`,
    [id, userId]
  );
  return result.rowCount > 0;
}

/*
|--------------------------------------------------------------------------
| Atualizar revisão do card
|--------------------------------------------------------------------------
*/

async function updateNextReview(id, nextReview, userId) {

  const result = await pool.query(
    `
    UPDATE cards
    SET next_review = $1
    WHERE id = $2
      AND EXISTS (
        SELECT 1 FROM decks
        WHERE decks.id = cards.deck_id AND decks.owner_id = $3
      )
    RETURNING *
    `,
    [nextReview, id, userId]
  );

  return result.rows[0];
}

module.exports = {
  getAllCards,
  getCardsByDeckId,
  createCard,
  updateCard,
  deleteCard,
  updateNextReview,
};