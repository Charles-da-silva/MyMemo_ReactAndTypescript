export async function getCards() {

  const response = await fetch("http://localhost:3001/cards");

  const data = await response.json();

  return data;
}