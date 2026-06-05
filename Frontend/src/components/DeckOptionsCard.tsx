
import type { Card, Deck } from "../types/types";
import { useState, useEffect } from "react";
import { useDeckImportExport } from "../hooks/useDeckImportExport";
import { getCardsByDeckId } from "../services/cardsService";
import iconHome from "../assets/home.png";
import Swal from 'sweetalert2';
import { getDecks, deleteDeck as deleteDeckAPI } from "../services/decksService";


interface DeckOptionsCardProps {
  mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeckId: string; // recebe o ID do deck selecionado
}

export default function DeckOptionsCard({ mode, setMode, selectedDeckId: initialSelected }: DeckOptionsCardProps) {

  const [selectedDeckId, setSelectedDeckId] = useState(initialSelected || ""); // Inicializa com o ID ou string vazia
  const [selectedDeck, setSelectedDeck] = useState<string[]>([initialSelected]);

  const [isReviewReady, setIsReviewReady] = useState(false);
  const [_currentQuestion, setcurrentQuestion] = useState(0);
  const [_selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [_reviewCards, setReviewCards] = useState<Card[]>([]);

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  console.log('DeckOptionsCard renderizado. Mode:', mode, 'isReviewReady:', isReviewReady, 'cards:', cards.length, 'selectedDeckId:', selectedDeckId);
  const { exportDecks } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  const showPopUp = ({ title, text, icon, action, confirmButtonText }: any) => {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      stopKeydownPropagation: true,
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
    setSelectedDeckId(initialSelected || "");
    setSelectedDeck([initialSelected]);
  }, [initialSelected]);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const apiDecks =
          await getDecks();
        setDecks(apiDecks);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDecks();
  }, []);

  useEffect(() => {
    async function fetchCards() {
      if (!selectedDeckId) return;
      try {
        console.log('Carregando cards para deck:', selectedDeckId);
        const apiCards = await getCardsByDeckId(selectedDeckId);
        console.log('Cards carregados:', apiCards.length);
        setCards(apiCards);
      } catch (error) {
        console.error('Erro ao carregar cards:', error);
      }
    }
    fetchCards();
  }, [selectedDeckId]);

  async function deleteDeck(id: string) {
    try {
      await deleteDeckAPI(id);

      const updatedDecks = decks.filter(d => d.id !== id);
      const updatedCards = cards.filter(c => c.deck_id !== id);

      setDecks(updatedDecks);
      setCards(updatedCards);

      if (selectedDeckId === id) setSelectedDeckId("");

      showPopUp({
        title: 'Pronto!',
        text: 'O Deck foi excluído com sucesso!',
        icon: 'success'
      });
    } catch (error) {
      console.error('Erro ao deletar deck:', error);
      showPopUp({
        title: 'Erro',
        text: 'Erro ao deletar o deck',
        icon: 'error'
      });
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
    console.log('useEffect review acionado. mode:', mode, 'isReviewReady:', isReviewReady);

    if (mode === "review" && !isReviewReady) {
      console.log('Entrando no filtro de cards...');
      const now = Date.now();
      console.log('Filtrando cards para estudo. Total de cards:', cards.length);
      console.log('Deck selecionado:', selectedDeckId);

      const cardsFromDeck = cards.filter(c => c.deck_id === selectedDeckId);
      console.log('Cards do deck:', cardsFromDeck.length);

      const dueCards = cardsFromDeck.filter(c => {
        const reviewTime = new Date(c.next_review).getTime();
        console.log(`Card: "${c.question?.substring(0, 30)}" - next_review: ${c.next_review} - reviewTime: ${reviewTime} - now: ${now} - isDue: ${reviewTime <= now}`);
        return reviewTime <= now;
      });

      console.log('Cards prontos para estudo:', dueCards.length);

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