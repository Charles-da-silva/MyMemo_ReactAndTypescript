const pool = require("../database/connection");

async function getChanges(userId, since, full) {
  const client = await pool.connect();

  try {
    await client.query(
      `INSERT INTO sync_cursors (owner_id, change_id)
       VALUES ($1, 0)
       ON CONFLICT (owner_id) DO NOTHING`,
      [userId]
    );
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");

    const cursorResult = await client.query(
      `SELECT COALESCE(
         (SELECT change_id FROM sync_cursors WHERE owner_id = $1),
         0
       )::TEXT AS cursor`,
      [userId]
    );
    const cursor = cursorResult.rows[0].cursor;

    if (!full && BigInt(since) > BigInt(cursor)) {
      const error = new Error("O cursor de sincronização está à frente do servidor.");
      error.code = "SYNC_CURSOR_AHEAD";
      throw error;
    }

    let decks;
    let cards;
    let deletedDeckIds = [];
    let deletedCardIds = [];

    if (full) {
      const [decksResult, cardsResult] = await Promise.all([
        client.query(
          "SELECT * FROM decks WHERE owner_id = $1 ORDER BY created_at DESC",
          [userId]
        ),
        client.query(
          `SELECT cards.*
           FROM cards
           JOIN decks ON decks.id = cards.deck_id
           WHERE decks.owner_id = $1
           ORDER BY cards.question ASC`,
          [userId]
        )
      ]);

      decks = decksResult.rows;
      cards = cardsResult.rows;
    } else {
      const changesResult = await client.query(
        `SELECT DISTINCT ON (entity_type, entity_id)
           entity_type,
           entity_id,
           operation
         FROM sync_changes
         WHERE owner_id = $1
           AND change_id > $2::BIGINT
           AND change_id <= $3::BIGINT
         ORDER BY entity_type, entity_id, change_id DESC`,
        [userId, since, cursor]
      );

      const upsertDeckIds = [];
      const upsertCardIds = [];

      for (const change of changesResult.rows) {
        if (change.operation === "delete") {
          if (change.entity_type === "deck") {
            deletedDeckIds.push(change.entity_id);
          } else {
            deletedCardIds.push(change.entity_id);
          }
        } else if (change.entity_type === "deck") {
          upsertDeckIds.push(change.entity_id);
        } else {
          upsertCardIds.push(change.entity_id);
        }
      }

      const [decksResult, cardsResult] = await Promise.all([
        upsertDeckIds.length
          ? client.query(
              `SELECT * FROM decks
               WHERE owner_id = $1 AND id = ANY($2::UUID[])`,
              [userId, upsertDeckIds]
            )
          : Promise.resolve({ rows: [] }),
        upsertCardIds.length
          ? client.query(
              `SELECT cards.*
               FROM cards
               JOIN decks ON decks.id = cards.deck_id
               WHERE decks.owner_id = $1 AND cards.id = ANY($2::UUID[])`,
              [userId, upsertCardIds]
            )
          : Promise.resolve({ rows: [] })
      ]);

      decks = decksResult.rows;
      cards = cardsResult.rows;
    }

    await client.query("COMMIT");

    return {
      cursor,
      decks,
      cards,
      deletedDeckIds,
      deletedCardIds
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getChanges
};
