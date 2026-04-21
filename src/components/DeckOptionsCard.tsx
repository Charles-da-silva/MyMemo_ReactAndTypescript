import { loadCards, loadDecks, saveCards, saveDecks } from "../storage/storage";
import type { Card, Deck } from "../types/types";
import { useState, useEffect } from "react";
import { useDeckImportExport } from "../hooks/useDeckImportExport";
import iconHome from "../assets/home.png";
import Swal from 'sweetalert2';

interface DeckOptionsCardProps {
  mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeck: string[]; // recebe o array pronto vindo do HomeCard
}

export default function DeckOptionsCard({ mode, setMode, selectedDeck: initialSelected }: DeckOptionsCardProps) {

  const [selectedDeckId, setSelectedDeckId] = useState(initialSelected[0] || ""); // Inicializa com o primeiro ID do array ou string vazia
  const [selectedDeck, setSelectedDeck] = useState<string[]>(initialSelected);

  const [isReviewReady, setIsReviewReady] = useState(false);
  const [_currentQuestion, setcurrentQuestion] = useState(0);
  const [_selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [_reviewCards, setReviewCards] = useState<Card[]>([]);

  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
  const [cards, setCards] = useState<Card[]>(() => loadCards());
  const { exportDecks } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  const showPopUp = ({ title, text, icon, action, confirmButtonText }: any) => {
    Swal.fire({
      title,
      text,
      icon,
      background: '#1E1E1E',
      color: '#fff',
      backdrop: 'rgba(0,0,0,0.8)',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText || 'OK',
      cancelButtonText: 'Cancelar',
      showCancelButton: !!action, // Só mostra cancelar se houver uma ação
    }).then((result) => {
      if (result.isConfirmed && action) action();
    });
  };


  // Sincroniza quando a prop initialSelected chegar/mudar
  useEffect(() => {
    if (initialSelected.length > 0) {
      setSelectedDeckId(initialSelected[0]);
      setSelectedDeck(initialSelected);
    }
  }, [initialSelected]);

  function deleteDeck(id: string) {
    const updatedDecks = decks.filter(d => d.id !== id);
    const updatedCards = cards.filter(c => c.deckId !== id);

    setDecks(updatedDecks);
    setCards(updatedCards);
    saveDecks(updatedDecks);
    saveCards(updatedCards);

    if (selectedDeckId === id) setSelectedDeckId("");
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
      <br />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>

        <div style={{ display: "flex", gap: "10px" }}><button
          onClick={() => {
            setIsReviewReady(false);
            setMode("review");
          }}
          className="btn btn-blue" >Estudar
        </button>
          <button
            onClick={() => {
              setMode("editDeck");
            }}
            className="btn btn-green" >Editar
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => exportDecks(selectedDeck)}
            className="btn btn-gray" >Exportar
          </button>
          <button
            onClick={() =>
              showPopUp({
                title: 'Atenção',
                text: 'Deseja realmente excluir o Deck inteiro e todas as perguntas dele permanentemente?',
                icon: 'warning',
                action: () => deleteDeck(selectedDeckId),
                confirmButtonText: 'Sim, excluir!'
              })}
            className="btn btn-red" >Excluir
        </button>
      </div>
    </div >  
      <br /><br />   

      <img src={iconHome}
        alt="Voltar a home" height={40} onClick={() => setMode("home")} 
        style={{cursor: 'pointer', paddingTop: 15}}/>
      <br /><br />
    </>
  );
}