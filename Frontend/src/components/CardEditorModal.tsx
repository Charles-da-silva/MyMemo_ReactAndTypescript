import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import "../styles/index.css";
import type { Card } from "../types/types";

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: any) => void;
  initialCard?: Card;
  deckId: string;
}

interface CardForm {
  id: string;
  deck_id: string;
  question: string;
  alternatives: string[];
  correct_answer: string;
  next_review: string;
  created_at: string;
  image: null | string;
}

export default function CardEditorModal({
  isOpen,
  onClose,
  onSave,
  initialCard,
  deckId,
}: CardEditorModalProps) {
  const [form, setForm] = useState<CardForm>({
    id: initialCard?.id || "",
    deck_id: deckId,
    question: initialCard?.question || "",
    alternatives: initialCard?.alternatives || ["", "", "", "", ""],
    correct_answer: initialCard?.correct_answer || "",
    next_review: new Date().toISOString(),
    created_at: new Date().toISOString(),
    image: null,
  });

  useEffect(() => {
    if (initialCard) {
      setForm({
        id: initialCard.id,
        deck_id: initialCard.deck_id,
        question: initialCard.question || "",
        alternatives: initialCard.alternatives || ["", "", "", "", ""],
        correct_answer: initialCard.correct_answer || "",
        next_review: initialCard.next_review,
        created_at: initialCard.created_at || new Date().toISOString(),
        image: initialCard.image || null,
      });
    }
  }, [initialCard]);

  const handleQuestionChange = (value: string) => {
    setForm({ ...form, question: value });
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...form.alternatives];
    newAlternatives[index] = value;
    setForm({ ...form, alternatives: newAlternatives });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setForm({ ...form, correct_answer: form.alternatives[index] });
  };

  const handleSave = () => {
    // Validações
    if (!form.question.trim()) {
      Swal.fire({
        title: 'Erro',
        text: 'A pergunta não pode estar vazia',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    const filledAlternatives = form.alternatives.filter(alt => alt.trim());
    if (filledAlternatives.length !== 5) {
      Swal.fire({
        title: 'Erro',
        text: 'Todas as 5 alternativas devem ser preenchidas',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    if (!form.correct_answer) {
      Swal.fire({
        title: 'Erro',
        text: 'Você deve selecionar uma resposta correta',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1E1E1E',
        color: '#fff',
        padding: '30px',
        borderRadius: '12px',
        maxHeight: '90%',
        overflowY: 'auto',
        width: '90%',
        
      }}>
        <h2 style={{ marginBottom: '20px' }}>
          {initialCard ? 'Editar Card' : 'Novo Card'}
        </h2>
        <br /><br />

        <label style={{ display: 'block', marginBottom: '15px' }}>
          <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Pergunta:</p>
          <textarea
            rows={8}
            value={form.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Digite a pergunta"
            style={{
              width: '98%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #3085d6',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              resize: 'vertical',
              fontFamily: 'inherit', 
            }}
          />
        </label>

        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Alternativas:</p>
        {form.alternatives.map((alt, index) => (
          <label key={index} style={{ display: 'block', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="radio"
                checked={form.correct_answer === alt}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <input
                type="text"
                value={alt}
                onChange={(e) => handleAlternativeChange(index, e.target.value)}
                placeholder={`Alternativa ${index + 1}`}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #3085d6',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                }}
              />
            </div>
          </label>
        ))}

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            className="btn btn-gray"
            style={{ padding: '8px 16px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn btn-blue"
            style={{ padding: '8px 16px' }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
