const { cert, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const db = require('../database/connection');

let firebaseAuth;

function getFirebaseAuth() {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    const error = new Error('FIREBASE_SERVICE_ACCOUNT não foi configurado.');
    error.code = 'AUTH_NOT_CONFIGURED';
    throw error;
  }

  const serviceAccount = JSON.parse(serviceAccountJson);
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  firebaseAuth = getAuth(app);
  return firebaseAuth;
}

async function registerUserAndClaimLegacyDecks(uid, email) {
  const knownUser = await db.query(
    'SELECT 1 FROM app_users WHERE firebase_uid = $1',
    [uid],
  );
  if (knownUser.rowCount > 0) {
    return;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [72146031]);

    const existingUsers = await client.query(
      'SELECT 1 FROM app_users LIMIT 1',
    );
    const isFirstUser = existingUsers.rowCount === 0;

    await client.query(
      `INSERT INTO app_users (firebase_uid, email)
       VALUES ($1, $2)
       ON CONFLICT (firebase_uid)
       DO UPDATE SET email = EXCLUDED.email`,
      [uid, email || null],
    );

    if (isFirstUser) {
      await client.query(
        'UPDATE decks SET owner_id = $1 WHERE owner_id IS NULL',
        [uid],
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }

  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(match[1]);
    await registerUserAndClaimLegacyDecks(
      decodedToken.uid,
      decodedToken.email,
    );
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    return next();
  } catch (error) {
    if (error.code === 'AUTH_NOT_CONFIGURED') {
      console.error(error.message);
      return res.status(503).json({ error: 'Autenticação não configurada no servidor.' });
    }
    if (typeof error.code === 'string' && error.code.startsWith('auth/')) {
      return res.status(401).json({ error: 'Token de autenticação inválido.' });
    }

    console.error('Falha ao autenticar requisição:', error);
    return res.status(500).json({ error: 'Não foi possível autenticar a requisição.' });
  }
}

module.exports = requireAuth;
