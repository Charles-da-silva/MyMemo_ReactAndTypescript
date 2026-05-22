export type Card = {
  id: string;
  deck_id: string;
  title: string;      // ex: Questão 1
  context: string;    // texto grande
  alternatives: string[];
  correct_answer: number;
  next_review: string; // ISO date string
  image?: string;
  question?: string; 
};

export type Deck = {
  id: string;
  name: string;
  description?: string;
};