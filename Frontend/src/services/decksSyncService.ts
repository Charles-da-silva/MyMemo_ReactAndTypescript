import { API_BASE_URL, authenticatedFetch } from "./api";
import {
  applySyncChanges,
  getSyncCheckpoint,
  type SyncChanges,
} from "./decksCache";

async function fetchChanges(since: string, full: boolean): Promise<SyncChanges> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/sync?since=${encodeURIComponent(since)}&full=${full}`,
  );

  if (!response.ok) {
    const details = await response.text();
    const message = details
      ? `Erro ao sincronizar decks e cards (HTTP ${response.status}): ${details}`
      : `Erro ao sincronizar decks e cards (HTTP ${response.status}).`;
    throw Object.assign(new Error(message), { status: response.status });
  }

  return response.json() as Promise<SyncChanges>;
}

export async function syncDecksAndCards(userId: string): Promise<void> {
  const checkpoint = await getSyncCheckpoint(userId);
  let cursor = checkpoint.cursor;
  let full = !checkpoint.initialized;
  let changes: SyncChanges;

  try {
    changes = await fetchChanges(cursor, full);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !("status" in error) ||
      error.status !== 409
    ) {
      throw error;
    }

    cursor = "0";
    full = true;
    changes = await fetchChanges(cursor, full);
  }

  await applySyncChanges(userId, changes, full);
}
