import { useState, useEffect } from "react";
import type { Card } from "../types/types";
import { loadCards, saveCards } from "../storage/storage";
import Logo from "./Logo";
import "../styles/index.css";

interface StudyCardProps {
  mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck";
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeckId: string; // prop para receber o ID do deck selecionado
}


export default function StudyCard({ setMode, selectedDeckId, mode }: StudyCardProps) {
    
    const [reviewCards, setReviewCards] = useState<Card[]>([]); // estado para as cartas em revisão
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // resposta selecionada pelo usuário

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
        <div className="studyCard" style={{height:"inherit"}}>
        <div>
          {isReviewReady && reviewCards.length > 0 && currentQuestion >= reviewCards.length && (
            <div style={{ textAlign: "center" }}>
                <Logo />
                <br /><br />                       
                <h2>Deck revisado com sucesso!</h2>
            </div>
          )}

          {isReviewReady && reviewCards.length === 0 && (
            <div style={{ textAlign: "center" }}>
                <Logo />
                <br /><br />                       
                <h2>Nada para revisar agora.</h2>
            </div>
          )}

          {currentCard && currentQuestion < reviewCards.length && (
            <div style={{ position: "relative", padding: "10px", border: "1px solid #eee", borderRadius: "12px"}}>
              
                {/* Botão de Excluir Pergunta na Revisão */}
                <div>
                <img 
                    src="src\assets\Edit2.png" 
                    alt="Editar card" 
                    onClick={() => setMode("editDeck")}
                    className="iconCard" 
                    style={{top: 11, right: 30}}/>
                <img 
                    src="src\assets\Trash.png" 
                    alt="Excluir card" 
                    onClick={() => deleteCard(currentCard.id)} 
                    className="iconCard" 
                    style={{top: 10, right: 3}}/>
                <br />
                </div>
                <p style={{ whiteSpace: "pre-wrap", // 👈 ISSO AQUI mantém as quebras de linha e espaços
                wordWrap: "break-word", // Garante que textos longos não quebrem o layout              
                padding: "5px", paddingTop: "15px",
                textAlign: "left" }}>{currentCard.question}</p>

                <br />
                
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
                    <div style={{ marginTop: 20, padding: "15px",  borderRadius: "8px" }}>
                    {selectedAnswer === currentCard.correctAnswer ? (<>
                        <img 
                        src="src\assets\Correct.png" 
                        alt="resposta correta" 
                        height={35}/>
                        <p>Correto!</p></>
                    ) : (<>
                        <img 
                        src="src\assets\Wrong.jpg" 
                        alt="resposta errada" 
                        height={35}/>
                        <p>A resposta certa é: {currentCard.alternatives[currentCard.correctAnswer]}</p></>
                    )}
                    <br />
                    <div className="btn-card">
                        <button onClick={() => { scheduleCard(currentCard, "hard"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }}
                        className="btn btn-red" style={{letterSpacing: "", marginRight: "5px"}}>Difícil (10 min)</button>

                        <button onClick={() => { scheduleCard(currentCard, "medium"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }} 
                        className="btn btn-yellow" style={{letterSpacing: "", marginRight: "5px"}}>Médio (4 hs)</button>

                        <button onClick={() => { scheduleCard(currentCard, "easy"); 
                        setcurrentQuestion(i => i + 1); setSelectedAnswer(null); }} 
                        className="btn btn-green" style={{letterSpacing: ""}}>Fácil (3 dias)</button>
                    </div>
                    </div>
                )}
            </div>
          )}          
        </div>
        <br />

        <div style={{ display: 'block', alignItems: 'center', width: '100%' }}> 
            <img 
                src="src\assets\home.png" 
                alt="Voltar a home" 
                height={35} onClick={() => setMode("home")} 
                style={{cursor: 'pointer', paddingRight: 10}}/>
        </div>
        </div>        
    );}