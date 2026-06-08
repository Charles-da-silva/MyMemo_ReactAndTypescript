import type { Deck } from "../types/types";

// URL base da API Node
const API_URL = "https://mymemo-reactandtypescript.onrender.com/decks";


// =========================
// BUSCAR TODOS OS DECKS
// =========================
export async function getDecks() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar decks");
    }

    // converte resposta para JSON
    const data = await response.json();

    return data;
    
  } catch (error) {
    console.error("Erro ao buscar decks:", error);

    throw error;
  }
}


// =========================
// CRIAR NOVO DECK
// =========================
export async function createDeck(deck: {
  name: string;
  description: string;
} | Deck) {
  try {
    const response = await fetch(API_URL, {
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

    const data = await response.json();

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
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(deck),
      }
    );

    return await response.json();

  } catch (error) {
    console.error(
      "Erro ao atualizar deck:",
      error
    );
  }
}

// =========================
// DELETAR DECK
// =========================
export async function deleteDeck(deckId: string) {
  try {
    await fetch(`${API_URL}/${deckId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Erro ao deletar deck:", error);
  }
}
