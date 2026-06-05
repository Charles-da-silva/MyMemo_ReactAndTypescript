const pool = require("../database/connection");

/*
|--------------------------------------------------------------------------
| Buscar todos os cards
|--------------------------------------------------------------------------
*/

async function getAllCards() {

  const result = await pool.query(`
    SELECT *
    FROM cards
    ORDER BY question ASC
  `);

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Buscar cards por deck
|--------------------------------------------------------------------------
*/

async function getCardsByDeckId(deckId) {

  console.log('Buscando cards do deck:', deckId);

  const result = await pool.query(
    `
      SELECT *
      FROM cards
      WHERE deck_id = $1
      ORDER BY question ASC
    `,
    [deckId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Criar novo card
|--------------------------------------------------------------------------
*/

async function createCard(card) {

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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
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
    card.alternatives ? JSON.stringify(card.alternatives) : null,
    card.image || null,
    card.created_at || new Date().toISOString()
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Atualizar card
|--------------------------------------------------------------------------
*/

async function updateCard(id, card) {

  const query = `
    UPDATE cards
    SET
      question = $1,
      correct_answer = $2,
      alternatives = $3,
      next_review = $4,
      image = $5
    WHERE id = $6
  `;

  const values = [
    card.question,
    card.correct_answer,
    JSON.stringify(card.alternatives),
    card.next_review,
    card.image,
    id
  ];

  await pool.query(query, values);

  return card;
}

/*
|--------------------------------------------------------------------------
| Excluir card
|--------------------------------------------------------------------------
*/

async function deleteCard(id) {

  await pool.query(
    `DELETE FROM cards WHERE id = $1`,
    [id]
  );
}

/*
|--------------------------------------------------------------------------
| Atualizar revisão do card
|--------------------------------------------------------------------------
*/

async function updateNextReview(id, nextReview) {

  const result = await pool.query(
    `
    UPDATE cards
    SET next_review = $1
    WHERE id = $2
    RETURNING *
    `,
    [nextReview, id]
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