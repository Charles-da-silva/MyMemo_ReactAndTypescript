import type { Card } from "../types/types";
import { API_BASE_URL, authenticatedFetch } from "./api";
import { auth } from "../firebase";
import {
  cacheCard,
  getCachedCardsByDeckId,
  removeCachedCard,
} from "./decksCache";

function getCurrentUserId(): string {
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("Faça login para acessar seus cards.");
  }
  return userId;
}

export async function getCardsByDeckId(deckId: string) {
  return getCachedCardsByDeckId(getCurrentUserId(), deckId);
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

  const createdCard: Card = await response.json();
  await cacheCard(getCurrentUserId(), createdCard);
  return createdCard;
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

  const updatedCard: Card = await response.json();
  await cacheCard(getCurrentUserId(), updatedCard);
  return updatedCard;
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
  const updatedCard: Card = await response.json();
  await cacheCard(getCurrentUserId(), updatedCard);
  return updatedCard;

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

  await removeCachedCard(getCurrentUserId(), id);
}