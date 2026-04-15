import { loadCards, loadDecks, saveCards, saveDecks } from "../storage/storage";
import type { Card, Deck } from "../types/types";
import { useState, useEffect } from "react";
import { useDeckImportExport } from "../hooks/useDeckImportExport";

interface DeckOptionsCardProps {
  mode: "home" | "deckOptions" | "createDeck" | "review";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review") => void;
  selectedDeck: string[]; // recebe o array pronto vindo do HomeCard
}

export default function DeckOptionsCard({ mode, setMode, selectedDeck: initialSelected  }: DeckOptionsCardProps) {

const [selectedDeckId, setSelectedDeckId] = useState(initialSelected[0] || ""); // Inicializa com o primeiro ID do array ou string vazia
const [selectedDeck, setSelectedDeck] = useState<string[]>(initialSelected);

const [isReviewReady, setIsReviewReady] = useState(false);
const [currentQuestion, setcurrentQuestion] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
const [reviewCards, setReviewCards] = useState<Card[]>([]);

const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
const [cards, setCards] = useState<Card[]>(() => loadCards());
const { exportDecks } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  // Sincroniza quando a prop initialSelected chegar/mudar
  useEffect(() => {
    if (initialSelected.length > 0) {
        setSelectedDeckId(initialSelected[0]);
        setSelectedDeck(initialSelected);
    }
  }, [initialSelected]);

  function deleteDeck(id: string) {
    if (window.confirm("Tem certeza que deseja excluir este deck e todos os seus cards?")) {
      const updatedDecks = decks.filter(d => d.id !== id);
      const updatedCards = cards.filter(c => c.deckId !== id);
      
      setDecks(updatedDecks);
      setCards(updatedCards);
      saveDecks(updatedDecks);
      saveCards(updatedCards);
      
      if (selectedDeckId === id) setSelectedDeckId("");
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  useEffect(() => {
    if (mode === "review" && !isReviewReady) {
      const now = Date.now();
      const dueCards = cards.filter(c => c.deckId === selectedDeckId && c.nextReview <= now);
      setReviewCards(shuffleArray(dueCards));
      setcurrentQuestion(0);
      setSelectedAnswer(null);
      setIsReviewReady(true);
    }
  }, [mode, selectedDeckId, isReviewReady, cards]);

  return (
    <>
           
      <select id="select-deck" value={selectedDeckId} onChange={(e) => {
          const id = e.target.value;
          setSelectedDeckId(id);
          setSelectedDeck([id]);
        }}>        
        {decks.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <br />
      <p className="personText largeText">O que deseja fazer?</p>
      <br /><br />
            

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)",  
        alignItems: "center", 
        gap: "10px", 
        alignContent: "center", 
        justifyContent: "center" 
        }}>
        
        <button 
            onClick={() => {
                    setIsReviewReady(false);
                    setMode("review");
                  }} 
            className="btn btn-blue" >Estudar
        </button> 
        <button 
            onClick={() => exportDecks(selectedDeck)} 
            className="btn btn-green" >Editar
        </button>
        <button 
            onClick={() => exportDecks(selectedDeck)} 
            className="btn btn-gray" >Exportar
        </button> 
        <button 
            onClick={() => deleteDeck(selectedDeckId)} 
            className="btn btn-red" >Excluir
        </button> 
      </div>  
      <br /><br />       

      

      <img src="src\assets\home.png" 
        alt="Voltar a home" height={30} onClick={() => setMode("home")} 
        style={{cursor: 'pointer', paddingTop: 15}}/>
    </>
  );
}