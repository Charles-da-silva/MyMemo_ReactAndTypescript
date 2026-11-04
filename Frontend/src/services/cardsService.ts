import type { Card } from "../types/types";
import { API_BASE_URL, authenticatedFetch } from "./api";

export async function getCardsByDeckId(deckId: string) {
  const response = await authenticatedFetch(`${API_BASE_URL}/cards/${deckId}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar cards");
  }

  return response.json();
}


export async function createCard(card: Card) {

  const response = await authenticatedFetch(
    `${API_BASE_URL}/cards`,
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

  const response = await authenticatedFetch(
    `${API_BASE_URL}/cards/${id}`,
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

  const response = await authenticatedFetch(
    `${API_BASE_URL}/cards/${id}/review`,
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

  if (!response.ok) {
    throw new Error("Erro ao atualizar revisão do card");
  }
  return response.json();

}



export async function deleteCard(
  id: string
) {

  const response = await authenticatedFetch(
    `${API_BASE_URL}/cards/${id}`,
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