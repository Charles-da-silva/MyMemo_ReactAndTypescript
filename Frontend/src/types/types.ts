export type Card = {
  id: string;
  deck_id: string;
  question: string;
  alternatives: string[];
  correct_answer: string;
  next_review: string;
  created_at: string;
  image: null | string;
};

export type Deck = {
  id: string;
  name: string;
  description?: string;
};