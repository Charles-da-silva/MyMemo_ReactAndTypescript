import { useState, useEffect } from "react";
import type { Card } from "../types/types";
import Logo from "./Logo";
import "../styles/index.css";
import editIcon from "../assets/Edit.png";
import trashIcon from "../assets/Trash.png";
import homeIcon from "../assets/home.png";
import correctIcon from "../assets/Correct.png";
import wrongIcon from "../assets/Wrong.jpg";
import Swal from 'sweetalert2';
import { getCardsByDeckId, updateCardReview, deleteCard as deleteCardService } from "../services/cardsService";

interface StudyCardProps {
  mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeckId: string; // prop para receber o ID do deck selecionado
}


export default function StudyCard({ setMode, selectedDeckId, mode }: StudyCardProps) {

  const [reviewCards, setReviewCards] = useState<Card[]>([]); // estado para as cartas em revisão
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // resposta selecionada pelo usuário

  const [cards, setCards] = useState<Card[]>([]);
  const [currentQuestion, setcurrentQuestion] = useState(0);

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

  async function deleteCard(id: string) {    

    try {
      // remove no backend
      await deleteCardService(id);
   
      const updatedAllCards = cards.filter(c => c.id !== id);
      setCards(updatedAllCards);
      showPopUp({
        title: 'Pronto!',
        text: 'O card foi excluído com sucesso!',
        icon: 'success'
      });

      setCards(updatedAllCards);
    
      showPopUp({
        title: 'Pronto!',
        text: 'O card foi excluído com sucesso!',
        icon: 'success'
      });

      setReviewCards(prev => {
        const newArr = prev.filter(c => c.id !== id);

        setcurrentQuestion(prevIndex => {
          if (prevIndex >= newArr.length) {
            return Math.max(0, newArr.length - 1);
          }
          return prevIndex;
        });

        return newArr;
      });

      setSelectedAnswer(null);
    
      } catch (error) {
  
        console.error(error);
  
        showPopUp({
          title: 'Erro',
          text: 'Erro ao excluir card.',
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

  async function scheduleCard(card: Card, difficulty: "easy" | "medium" | "hard") {
    let delay = 0;
    if (difficulty === "easy") delay = 3 * 24 * 60 * 60 * 1000; // 3 dias 
    if (difficulty === "medium") delay = 4 * 60 * 60 * 1000; // 4 horas
    if (difficulty === "hard") delay = 10 * 60 * 1000; // 10 minutos

    const nextReview =
    new Date(Date.now() + delay).toISOString();
    
    // salva no banco
    await updateCardReview(
      card.id,
      nextReview
    );

    // atualiza frontend
    const updatedCards = cards.map(c =>
      c.id === card.id
        ? {
            ...c,
            next_review: nextReview
          }
        : c
    );

    setCards(updatedCards);
  }

  const isFinished = currentQuestion >= reviewCards.length;



  useEffect(() => {
    async function loadReviewCards() {
      try {
        console.log('selectedDeckId', selectedDeckId);

        // Busca os cards da API
        const apiCards = await getCardsByDeckId(selectedDeckId);
        console.log("CARDS DA API:", apiCards);

        // Atualiza o state principal
        setCards(apiCards);

        console.log("selectedDeckId:", selectedDeckId);
        console.log("apiCards:", apiCards);
        console.log("Date.now():", Date.now());

        // Filtra cards do deck e prontos para revisão
        const dueCards = apiCards.filter(
          (c: Card) => {
            const nextReview = new Date(c.next_review).getTime();
            const isDue = nextReview <= Date.now();
            console.log(`Card "${c.question?.substring(0, 30)}": next_review=${c.next_review}, reviewTime=${nextReview}, now=${Date.now()}, isDue=${isDue}`);
            return c.deck_id === selectedDeckId && isDue;
          }
        );

        console.log("Cards prontos para revisão:", dueCards.length);

        // Embaralha os cards
        setReviewCards(shuffleArray(dueCards));

        // Reinicia estado da revisão
        setcurrentQuestion(0);
        setSelectedAnswer(null);

      } catch (err) {
        console.error("Erro ao carregar cards:", err);
      }
    }

    if (mode === "review") {
      loadReviewCards();
    }

  }, [mode, selectedDeckId]);



  if (reviewCards.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <Logo />
        <br /><br />
        <h2>Nada para revisar agora.</h2>
        <div style={{ display: 'block', alignItems: 'center', width: '100%' }}>
          <img
            src={homeIcon}
            alt="Voltar a home"
            height={35} onClick={() => setMode("home")}
            style={{ cursor: 'pointer', paddingRight: 10 }} />
        </div>
      </div>
    );
  };

  if (isFinished) {
    return (
      <div style={{ textAlign: "center" }}>
        <Logo />
        <br /><br />
        <h2>Deck revisado com sucesso!</h2>
        <div style={{ display: 'block', alignItems: 'center', width: '100%' }}>
          <img
            src={homeIcon}
            alt="Voltar a home"
            height={35} onClick={() => setMode("home")}
            style={{ cursor: 'pointer', paddingRight: 10 }} />
        </div>
      </div>
    );
  }

  const currentCard = reviewCards[currentQuestion];

  // proteção final (só por segurança)
  if (!currentCard) return null;

  return (
    <div className="studyCard" style={{ height: "inherit" }}>
      <div>


        {currentCard && currentQuestion < reviewCards.length && (
          <div style={{ position: "relative", padding: "10px", border: "1px solid #eee", borderRadius: "12px" }}>

            {/* Botão de Excluir Pergunta na Revisão */}
            <div>
              <img
                src={editIcon}
                alt="Editar card"
                onClick={() => setMode("editDeck")}
                className="iconCard"
                style={{ top: 11, right: 30 }} />
              <img
                src={trashIcon}
                alt="Excluir card"
                onClick={() => 
                  showPopUp({
                  title: 'Atenção',
                  text: 'Deseja realmente excluir esta pergunta permanentemente?',
                  icon: 'warning',
                  action: () => deleteCard(currentCard.id),
                  confirmButtonText: 'Sim, excluir!'
                })}
                className="iconCard"
                style={{ top: 10, right: 3 }} />
              <br />
            </div>
            <p style={{
              whiteSpace: "pre-wrap", // mantém as quebras de linha e espaços
              wordWrap: "break-word", // Garante que textos longos não quebrem o layout              
              padding: "5px", paddingTop: "15px",
              textAlign: "left"
            }}>{currentCard.question}</p>

            <br />

            {currentCard.image && (
              <img src={currentCard.image} alt="Pergunta" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "15px" }} />
            )}




            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {currentCard.alternatives.map((alt: string, index: number) => (
                <button
                  className="options"
                  key={`${currentCard.id}-${alt}`}
                  onClick={() => setSelectedAnswer(index)}
                  style={{ fontWeight: "bold", textAlign: "left", padding: "12px", borderRadius: "8px", cursor: "pointer" }}>
                  {alt}
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div style={{ marginTop: 20, padding: "15px", borderRadius: "8px" }}>
                {currentCard.alternatives[selectedAnswer] === currentCard.correct_answer ? (<>
                  <img
                    src={correctIcon}
                    alt="resposta correta"
                    height={35} />
                  <p>Correto!</p></>
                ) : (<>
                  <img
                    src={wrongIcon}
                    alt="resposta errada"
                    height={35} />
                  <p>A resposta certa é: {currentCard.correct_answer}</p></>
                )}
                <br />
                <div className="btn-card">
                  <button onClick={() => {
                    scheduleCard(currentCard, "hard");
                    setSelectedAnswer(null); setTimeout(() => { setcurrentQuestion(i => i + 1); }, 0);
                  }}
                    className="btn btn-red" style={{ letterSpacing: "", marginRight: "5px" }}>Difícil (10 min)</button>

                  <button onClick={() => {
                    scheduleCard(currentCard, "medium");
                    setSelectedAnswer(null); setTimeout(() => { setcurrentQuestion(i => i + 1); }, 0);
                  }}
                    className="btn btn-yellow" style={{ letterSpacing: "", marginRight: "5px" }}>Médio (4 hs)</button>

                  <button onClick={() => {
                    scheduleCard(currentCard, "easy");
                    setSelectedAnswer(null); setTimeout(() => { setcurrentQuestion(i => i + 1); }, 0);
                  }}
                    className="btn btn-green" style={{ letterSpacing: "" }}>Fácil (3 dias)</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <br />

      <div style={{ display: 'block', alignItems: 'center', width: '100%' }}>
        <img
          src={homeIcon}
          alt="Voltar a home"
          height={35} onClick={() => setMode("home")}
          style={{ cursor: 'pointer', paddingRight: 10 }} />
      </div>
    </div>
  );
}