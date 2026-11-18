const db = require('./connection');

async function initializeDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      firebase_uid TEXT PRIMARY KEY,
      email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    ALTER TABLE decks
    ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES app_users(firebase_uid)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_decks_owner_id ON decks(owner_id)
  `);

  await db.query(`
    ALTER TABLE decks
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  `);
  await db.query(`
    UPDATE decks
    SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
    WHERE updated_at IS NULL
  `);
  await db.query(`
    ALTER TABLE decks
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET NOT NULL
  `);

  await db.query(`
    ALTER TABLE cards
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  `);
  await db.query(`
    UPDATE cards
    SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
    WHERE updated_at IS NULL
  `);
  await db.query(`
    ALTER TABLE cards
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET NOT NULL
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sync_cursors (
      owner_id TEXT PRIMARY KEY REFERENCES app_users(firebase_uid),
      change_id BIGINT NOT NULL DEFAULT 0
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sync_changes (
      owner_id TEXT NOT NULL REFERENCES app_users(firebase_uid),
      change_id BIGINT NOT NULL,
      entity_type TEXT NOT NULL CHECK (entity_type IN ('deck', 'card')),
      entity_id UUID NOT NULL,
      operation TEXT NOT NULL CHECK (operation IN ('upsert', 'delete')),
      changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (owner_id, change_id)
    )
  `);

  await db.query(`
    CREATE OR REPLACE FUNCTION append_sync_change(
      target_owner_id TEXT,
      target_entity_type TEXT,
      target_entity_id UUID,
      target_operation TEXT
    ) RETURNS VOID AS $$
    DECLARE
      next_change_id BIGINT;
    BEGIN
      IF target_owner_id IS NULL THEN
        RETURN;
      END IF;

      INSERT INTO sync_cursors (owner_id, change_id)
      VALUES (target_owner_id, 1)
      ON CONFLICT (owner_id)
      DO UPDATE SET change_id = sync_cursors.change_id + 1
      RETURNING change_id INTO next_change_id;

      INSERT INTO sync_changes (
        owner_id,
        change_id,
        entity_type,
        entity_id,
        operation
      ) VALUES (
        target_owner_id,
        next_change_id,
        target_entity_type,
        target_entity_id,
        target_operation
      );
    END;
    $$ LANGUAGE plpgsql
  `);

  await db.query(`
    CREATE OR REPLACE FUNCTION set_sync_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await db.query(`
    CREATE OR REPLACE FUNCTION record_deck_sync_change()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'DELETE' THEN
        PERFORM append_sync_change(OLD.owner_id, 'deck', OLD.id, 'delete');
        RETURN OLD;
      END IF;

      IF TG_OP = 'UPDATE' AND OLD.owner_id IS DISTINCT FROM NEW.owner_id THEN
        PERFORM append_sync_change(OLD.owner_id, 'deck', OLD.id, 'delete');
      END IF;

      PERFORM append_sync_change(NEW.owner_id, 'deck', NEW.id, 'upsert');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await db.query(`
    CREATE OR REPLACE FUNCTION record_card_sync_change()
    RETURNS TRIGGER AS $$
    DECLARE
      card_owner_id TEXT;
      card_id UUID;
      card_deck_id UUID;
      change_operation TEXT;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        card_id = OLD.id;
        card_deck_id = OLD.deck_id;
        change_operation = 'delete';
      ELSE
        card_id = NEW.id;
        card_deck_id = NEW.deck_id;
        change_operation = 'upsert';
      END IF;

      SELECT owner_id INTO card_owner_id
      FROM decks
      WHERE id = card_deck_id;

      PERFORM append_sync_change(
        card_owner_id,
        'card',
        card_id,
        change_operation
      );

      IF TG_OP = 'DELETE' THEN
        RETURN OLD;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS decks_set_updated_at ON decks;
    CREATE TRIGGER decks_set_updated_at
    BEFORE UPDATE ON decks
    FOR EACH ROW EXECUTE FUNCTION set_sync_updated_at()
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS cards_set_updated_at ON cards;
    CREATE TRIGGER cards_set_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION set_sync_updated_at()
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS decks_record_sync_change ON decks;
    CREATE TRIGGER decks_record_sync_change
    AFTER INSERT OR UPDATE OR DELETE ON decks
    FOR EACH ROW EXECUTE FUNCTION record_deck_sync_change()
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS cards_record_sync_change ON cards;
    CREATE TRIGGER cards_record_sync_change
    AFTER INSERT OR UPDATE OR DELETE ON cards
    FOR EACH ROW EXECUTE FUNCTION record_card_sync_change()
  `);
}

module.exports = initializeDatabase;
