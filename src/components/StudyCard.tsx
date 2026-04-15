
import { useState, useEffect } from "react";
import type { Card, Deck } from "../types/types";
import { loadCards, loadDecks, saveCards } from "../storage/storage";

interface StudyCardProps {
    mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeck: string[]; // nova prop para receber o deck selecionado
  selectedDeckId: string; // nova prop para receber o ID do deck selecionado
}



export default function StudyCard({ setMode, selectedDeck, selectedDeckId, mode }: StudyCardProps) {
    
    const [reviewCards, setReviewCards] = useState<Card[]>([]); // estado para as cartas em revisão
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // resposta selecionada pelo usuário

    const [decks, setDecks] = useState<Deck[]>(loadDecks());
    const [cards, setCards] = useState<Card[]>(loadCards());
    const [currentQuestion, setcurrentQuestion] = useState(0);
    const [isReviewReady, setIsReviewReady] = useState(false);

    function deleteCard(id: string) {
    if (window.confirm("Deseja excluir esta pergunta permanentemente?")) {
      // Remove do estado principal de todos os cards
      const updatedAllCards = cards.filter(c => c.id !== id);
      setCards(updatedAllCards);
      saveCards(updatedAllCards);

      // Remove da fila de revisão atual para não travar a tela
      const updatedReviewCards = reviewCards.filter(c => c.id !== id);
      setReviewCards(updatedReviewCards);
      
      // Reseta a resposta selecionada para a próxima carta
      setSelectedAnswer(null);
    
      
      // Se era a última carta, o sistema de "Sucesso" vai detectar automaticamente
      // se o currentQuestion agora for >= que o novo length
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

  function scheduleCard(card: any, difficulty: "easy" | "medium" | "hard") {
    let delay = 0;
    if (difficulty === "easy") delay = 3 * 24 * 60 * 60 * 1000; // 3 dias 
    if (difficulty === "medium") delay = 4 * 60 * 60 * 1000; // 4 horas
    if (difficulty === "hard") delay = 10 * 60 * 1000; // 10 minutos

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, nextReview: Date.now() + delay } : c
    );
    setCards(updatedCards);
    saveCards(updatedCards);
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

  const currentCard = reviewCards[currentQuestion] as any;

    return (
        <div className="studyCard" style={{ display: 'flex', flexDirection: 'column', margin: '0'}}>
        <div >
          {isReviewReady && reviewCards.length > 0 && currentQuestion >= reviewCards.length && (
            <div style={{ textAlign: "center" }}>
              <h2>🎉 Deck revisado com sucesso!</h2>
            </div>
          )}

          {isReviewReady && reviewCards.length === 0 && (
            <p>☕ Nada para revisar agora.</p>
          )}

          {currentCard && currentQuestion < reviewCards.length && (
            <div style={{ position: "relative", padding: "10px", border: "1px solid #eee", borderRadius: "12px" }}>
              
                {/* Botão de Excluir Pergunta na Revisão */}
                <img 
                    src="src\assets\Edit2.png" 
                    alt="Editar deck" 
                    height={25} onClick={() => setMode("editDeck")} 
                    style={{cursor: 'pointer', paddingRight: 10, position: "absolute", top: 11, right: 30}}/>
                <img 
                    src="src\assets\Trash.png" 
                    alt="Excluir deck" 
                    height={25} onClick={() => deleteCard(currentCard.id)} 
                    style={{cursor: 'pointer', paddingRight: 10, position: "absolute", top: 10, right: 3}}/>
                <br />
                <p style={{ fontSize: "10px", whiteSpace: "pre-wrap", // 👈 ISSO AQUI mantém as quebras de linha e espaços
                wordWrap: "break-word", // Garante que textos longos não quebrem o layout              
                padding: "5px",
                textAlign: "left" }}>{currentCard.question}</p>
                
                {currentCard.image && (
                    <img src={currentCard.image} alt="Pergunta" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "15px" }} />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentCard.alternatives.map((alt: string, index: number) => (
                    <button key={index} onClick={() => setSelectedAnswer(index)} 
                    style={{ textAlign: "left", padding: "12px", borderRadius: "8px", 
                    cursor: "pointer" }}>
                        {alt}
                    </button>
                    ))}
                </div>

                {selectedAnswer !== null && (
                    <div style={{ marginTop: 20, padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "8px" }}>
                    {selectedAnswer === currentCard.correctAnswer ? (
                        <p style={{ color: "#0cbe51", fontWeight: "bold" }}>✅ Correto!</p>
                    ) : (
                        <p style={{ color: "#991b1b" }}>❌ Resposta certa: {currentCard.alternatives[currentCard.correctAnswer]}</p>
                    )}
                    
                    <div style={{ marginTop: 10 }}>
                        <button onClick={() => { scheduleCard(currentCard, "hard"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }}
                        style={{ background: "orangered" }}>Difícil (10 min)</button>

                        <button onClick={() => { scheduleCard(currentCard, "medium"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }} 
                        style={{ marginLeft: 10, background: "orange"}}>Médio (4 hs)</button>

                        <button onClick={() => { scheduleCard(currentCard, "easy"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }} 
                        style={{ marginLeft: 10, background: "green" }}>Fácil (3 dias)</button>
                    </div>
                    </div>
                )}
            </div>
          )}

          
        </div>

        <div style={{ display: 'block', alignItems: 'center', width: '100%' }}> 
        <img 
            src="src\assets\home.png" 
            alt="Voltar a home" 
            height={25} onClick={() => setMode("home")} 
            style={{cursor: 'pointer', paddingRight: 10}}/>
        </div>




        </div>
        
    );}