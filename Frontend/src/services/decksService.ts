import type { Deck } from "../types/types";
import { API_BASE_URL, authenticatedFetch } from "./api";
import { auth } from "../firebase";
import {
  cacheDeck,
  getCachedDecks,
  removeCachedDeck,
} from "./decksCache";

const API_URL = `${API_BASE_URL}/decks`;

export async function getDecks() {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("Faça login para acessar seus decks.");
  }

  return getCachedDecks(user.uid);
}


// =========================
// CRIAR NOVO DECK
// =========================
export async function createDeck(deck: {
  name: string;
  description: string;
} | Deck) {
  try {
    const response = await authenticatedFetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(deck),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      throw new Error("Erro ao criar deck");
    }

    const data: Deck = await response.json();
    const user = auth?.currentUser;
    if (!user) {
      throw new Error("Faça login para acessar seus decks.");
    }
    await cacheDeck(user.uid, data);

    return data;
  } catch (error) {
    console.error("Erro ao criar deck:", error);
    throw error;
  }
}

// =========================
// ATUALIZAR DECK
// =========================
export async function updateDeck(
  id: string,
  deck: {
    name: string;
    description: string;
  }
) {
  try {
    const response = await authenticatedFetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(deck),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar deck");
    }
    const data: Deck = await response.json();
    const user = auth?.currentUser;
    if (!user) {
      throw new Error("Faça login para acessar seus decks.");
    }
    await cacheDeck(user.uid, data);
    return data;

  } catch (error) {
    console.error("Erro ao atualizar deck:", error);
    throw error;
  }
}

// =========================
// DELETAR DECK
// =========================
export async function deleteDeck(deckId: string) {
  try {
    const response = await authenticatedFetch(`${API_URL}/${deckId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar deck");
    }
    const user = auth?.currentUser;
    if (!user) {
      throw new Error("Faça login para acessar seus decks.");
    }
    await removeCachedDeck(user.uid, deckId);
  } catch (error) {
    console.error("Erro ao deletar deck:", error);
    throw error;
  }
}
