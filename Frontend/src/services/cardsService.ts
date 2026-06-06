import type { Card } from "../types/types";

export async function getCardsByDeckId(deckId: string) {

  const response = await fetch(`https://mymemo-reactandtypescript.onrender.com/cards/${deckId}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar cards");
  }

  return response.json();
}


export async function createCard(card: Card) {

  const response = await fetch(
    "https://mymemo-reactandtypescript.onrender.com/cards",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify(card)
    }
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(errorText);

    throw new Error(
      "Erro ao criar card"
    );
  }

  return response.json();
}


export async function updateCard(
  id: string,
  card: Card
) {

  const response = await fetch(
    `https://mymemo-reactandtypescript.onrender.com/cards/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(card)
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar card");
  }

  return response.json();
}


export async function updateCardReview(
  id: string,
  next_review: string
) {

  const response = await fetch(
    `https://mymemo-reactandtypescript.onrender.com/cards/${id}/review`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        next_review
      })
    }
  );

  return response.json();

}



export async function deleteCard(
  id: string
) {

  const response = await fetch(
    `https://mymemo-reactandtypescript.onrender.com/cards/${id}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao excluir card"
    );
  }
}