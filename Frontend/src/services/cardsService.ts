export async function getCards() {

  const response = await fetch("http://localhost:3001/cards");

  if (!response.ok) {
    throw new Error("Erro ao buscar cards");
  }

  return response.json();
}