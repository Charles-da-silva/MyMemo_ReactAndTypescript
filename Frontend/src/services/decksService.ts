// URL base da API Node
const API_URL = "http://localhost:3001/decks";


// =========================
// BUSCAR TODOS OS DECKS
// =========================
export async function getDecks() {
  try {
    const response = await fetch(API_URL);

    // converte resposta para JSON
    const data = await response.json();

    return data;
    
  } catch (error) {
    console.error("Erro ao buscar decks:", error);

    // retorna array vazio para evitar quebra no React
    return [];
  }
}


// =========================
// CRIAR NOVO DECK
// =========================
export async function createDeck(deck: {
  name: string;
  description: string;
}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(deck),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao criar deck:", error);
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