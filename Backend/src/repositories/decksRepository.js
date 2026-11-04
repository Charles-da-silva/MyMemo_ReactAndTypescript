const db = require('../database/connection');
const crypto = require("crypto");

async function getAllDecks(userId) {

  const result = await db.query(
    'SELECT * FROM decks WHERE owner_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  return result.rows;
}

async function createDeck(deck, userId) {

  const query = `
    INSERT INTO decks (
      id,
      name,
      description,
      owner_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    deck.id || crypto.randomUUID(),
    deck.name,
    deck.description || null,
    userId
  ];

  const result = await db.query(query, values);

  return result.rows[0];
}

async function updateDeck(id, deck, userId) {

  const result = await db.query(
    `
    UPDATE decks
    SET
      name = $1,
      description = $2
    WHERE id = $3 AND owner_id = $4
    RETURNING *
    `,
    [
      deck.name,
      deck.description,
      id,
      userId,
    ]
  );

  return result.rows[0];
}

async function deleteDeck(id, userId) {

  const result = await db.query(
    'DELETE FROM decks WHERE id = $1 AND owner_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rowCount > 0;
}

module.exports = {
  getAllDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};