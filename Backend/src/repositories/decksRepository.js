const db = require('../database/connection');
const crypto = require("crypto");

async function getAllDecks() {

  const result = await db.query(
    'SELECT * FROM decks ORDER BY created_at DESC'
  );

  return result.rows;
}

async function createDeck(deck) {

  const query = `
    INSERT INTO decks (
      id,
      name,
      description
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [
    deck.id || crypto.randomUUID(),
    deck.name,
    deck.description || null
  ];

  const result = await db.query(query, values);

  return result.rows[0];
}

async function updateDeck(id, deck) {

  const result = await db.query(
    `
    UPDATE decks
    SET
      name = $1,
      description = $2
    WHERE id = $3
    RETURNING *
    `,
    [
      deck.name,
      deck.description,
      id,
    ]
  );

  return result.rows[0];
}

async function deleteDeck(id) {

  await db.query(
    'DELETE FROM decks WHERE id = $1',
    [id]
  );
}

module.exports = {
  getAllDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};