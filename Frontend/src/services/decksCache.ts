import type { Card, Deck } from "../types/types";

export interface SyncChanges {
  cursor: string;
  decks: Deck[];
  cards: Card[];
  deletedDeckIds: string[];
  deletedCardIds: string[];
}

interface CacheMetadata {
  key: string;
  value: SyncCheckpoint;
}

export interface SyncCheckpoint {
  cursor: string;
  initialized: boolean;
}

const databasePromises = new Map<string, Promise<IDBDatabase>>();

function openDatabase(userId: string): Promise<IDBDatabase> {
  const cachedPromise = databasePromises.get(userId);
  if (cachedPromise) {
    return cachedPromise;
  }

  const databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(
      `mymemo-cache-${encodeURIComponent(userId)}`,
      1,
    );

    request.onupgradeneeded = () => {
      const database = request.result;
      database.createObjectStore("decks", { keyPath: "id" });
      const cards = database.createObjectStore("cards", { keyPath: "id" });
      cards.createIndex("deck_id", "deck_id");
      database.createObjectStore("metadata", { keyPath: "key" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("O cache local está bloqueado."));
  });

  databasePromises.set(userId, databasePromise);
  databasePromise.catch(() => databasePromises.delete(userId));
  return databasePromise;
}

function transactionCompleted(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("A atualização do cache foi cancelada."));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function removeCardsForDeck(
  cards: IDBObjectStore,
  deckId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = cards.index("deck_id").openCursor(IDBKeyRange.only(deckId));

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        resolve();
        return;
      }

      cursor.delete();
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getSyncCheckpoint(userId: string): Promise<SyncCheckpoint> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("metadata", "readonly");
  const completed = transactionCompleted(transaction);
  const [metadata] = await Promise.all([
    requestResult(transaction.objectStore("metadata").get("syncCheckpoint")),
    completed,
  ]);
  return metadata?.value ?? { cursor: "0", initialized: false };
}

export async function applySyncChanges(
  userId: string,
  changes: SyncChanges,
  replaceAll: boolean,
): Promise<void> {
  const database = await openDatabase(userId);
  const transaction = database.transaction(
    ["decks", "cards", "metadata"],
    "readwrite",
  );
  const completed = transactionCompleted(transaction);
  const decks = transaction.objectStore("decks");
  const cards = transaction.objectStore("cards");

  if (replaceAll) {
    decks.clear();
    cards.clear();
  }

  changes.decks.forEach(deck => decks.put(deck));
  changes.cards.forEach(card => cards.put(card));
  changes.deletedCardIds.forEach(id => cards.delete(id));

  const deckRemovals = changes.deletedDeckIds.map(deckId => {
    decks.delete(deckId);
    return removeCardsForDeck(cards, deckId);
  });

  transaction.objectStore("metadata").put({
    key: "syncCheckpoint",
    value: { cursor: changes.cursor, initialized: true },
  } satisfies CacheMetadata);

  await Promise.all([...deckRemovals, completed]);
}

export async function getCachedDecks(userId: string): Promise<Deck[]> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("decks", "readonly");
  const completed = transactionCompleted(transaction);
  const [decks] = await Promise.all([
    requestResult(transaction.objectStore("decks").getAll()),
    completed,
  ]);
  return (decks as Deck[]).sort((left, right) =>
    (right.created_at ?? "").localeCompare(left.created_at ?? ""),
  );
}

export async function getCachedCardsByDeckId(
  userId: string,
  deckId: string,
): Promise<Card[]> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("cards", "readonly");
  const completed = transactionCompleted(transaction);
  const [cards] = await Promise.all([
    requestResult(transaction.objectStore("cards").index("deck_id").getAll(deckId)),
    completed,
  ]);
  return (cards as Card[]).sort((left, right) =>
    left.question.localeCompare(right.question),
  );
}

export async function cacheDeck(userId: string, deck: Deck): Promise<void> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("decks", "readwrite");
  const completed = transactionCompleted(transaction);
  transaction.objectStore("decks").put(deck);
  await completed;
}

export async function removeCachedDeck(
  userId: string,
  deckId: string,
): Promise<void> {
  const database = await openDatabase(userId);
  const transaction = database.transaction(["decks", "cards"], "readwrite");
  const completed = transactionCompleted(transaction);
  transaction.objectStore("decks").delete(deckId);
  await Promise.all([
    removeCardsForDeck(transaction.objectStore("cards"), deckId),
    completed,
  ]);
}

export async function cacheCard(userId: string, card: Card): Promise<void> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("cards", "readwrite");
  const completed = transactionCompleted(transaction);
  transaction.objectStore("cards").put(card);
  await completed;
}

export async function removeCachedCard(
  userId: string,
  cardId: string,
): Promise<void> {
  const database = await openDatabase(userId);
  const transaction = database.transaction("cards", "readwrite");
  const completed = transactionCompleted(transaction);
  transaction.objectStore("cards").delete(cardId);
  await completed;
}
