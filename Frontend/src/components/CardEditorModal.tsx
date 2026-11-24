import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import "../styles/index.css";
import type { Card } from "../types/types";
import { uploadCardImage } from "../services/cardImagesService";

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Card) => Promise<void> | void;
  initialCard?: Card;
  deckId: string;
}

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const maxImageSizeBytes = 10 * 1024 * 1024;

export default function CardEditorModal({
  isOpen,
  onClose,
  onSave,
  initialCard,
  deckId,
}: CardEditorModalProps) {
  const getCorrectAnswerIndex = (card?: Card) => {
    if (!card) return null;

    const index = card.alternatives.findIndex(
      alt => alt === card.correct_answer
    );

    return index >= 0 ? index : null;
  };

  const [form, setForm] = useState<Card>({
    id: initialCard?.id || "",
    deck_id: deckId,
    question: initialCard?.question || "",
    alternatives: initialCard?.alternatives || ["", "", "", "", ""],
    correct_answer: initialCard?.correct_answer || "",
    next_review: initialCard?.next_review || new Date().toISOString(),
    created_at: initialCard?.created_at || new Date().toISOString(),
    image: initialCard?.image || null,
  });
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    getCorrectAnswerIndex(initialCard)
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imagePreviewUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const setSelectedImage = (file: File | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    const previewUrl = file ? URL.createObjectURL(file) : null;
    imagePreviewUrlRef.current = previewUrl;
    setImagePreviewUrl(previewUrl);
    setSelectedImageFile(file);
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  const handleQuestionChange = (value: string) => {
    setForm({ ...form, question: value });
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...form.alternatives];
    newAlternatives[index] = value;
    setForm({
      ...form,
      alternatives: newAlternatives,
      correct_answer:
        correctAnswerIndex === index
          ? value
          : form.correct_answer
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswerIndex(index);
    setForm({ ...form, correct_answer: form.alternatives[index] });
  };

  const handleAddAlternative = () => {
    if (form.alternatives.length >= 5) return;
    setForm(currentForm => ({
      ...currentForm,
      alternatives: [...currentForm.alternatives, ""],
    }));
  };

  const handleRemoveAlternative = (index: number) => {
    if (form.alternatives.length <= 2) return;

    setForm(currentForm => ({
      ...currentForm,
      alternatives: currentForm.alternatives.filter((_, i) => i !== index),
      correct_answer:
        correctAnswerIndex === index
          ? ""
          : currentForm.correct_answer,
    }));

    setCorrectAnswerIndex(currentIndex => {
      if (currentIndex === null || currentIndex === index) return null;
      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  const handleImageSelection = (file: File | undefined) => {
    if (!file) return;

    if (!allowedImageTypes.has(file.type)) {
      Swal.fire({
        title: 'Formato não suportado',
        text: 'Escolha uma imagem JPEG, PNG, WebP ou GIF.',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    if (file.size > maxImageSizeBytes) {
      Swal.fire({
        title: 'Imagem muito grande',
        text: 'O tamanho máximo da imagem é 10 MB.',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    setSelectedImage(file);
  };

  const handleSave = async () => {
    if (isSaving) return;
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

    const alternatives = form.alternatives.map(alt => alt.trim());

    if (alternatives.length < 2) {
      Swal.fire({
        title: 'Erro',
        text: 'Preencha pelo menos duas alternativas',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    if (alternatives.length > 5) {
      Swal.fire({
        title: 'Erro',
        text: 'O card pode ter no máximo cinco alternativas',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    if (alternatives.some(alternative => !alternative)) {
      Swal.fire({
        title: 'Erro',
        text: 'Todas as alternativas precisam estar preenchidas',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    const selectedCorrectAnswer =
      correctAnswerIndex !== null
        ? form.alternatives[correctAnswerIndex]?.trim()
        : "";

    if (!selectedCorrectAnswer) {
      Swal.fire({
        title: 'Erro',
        text: 'Você deve selecionar uma resposta correta',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    setIsSaving(true);
    try {
      let image = form.image;
      if (selectedImageFile) {
        image = await uploadCardImage(selectedImageFile);
        setForm((currentForm) => ({ ...currentForm, image }));
        setSelectedImage(null);
      }

      await onSave({
        ...form,
        alternatives,
        image,
        correct_answer: selectedCorrectAnswer,
      });
      handleClose();
    } catch (error) {
      Swal.fire({
        title: 'Erro ao salvar card',
        text: error instanceof Error ? error.message : 'Não foi possível salvar o card.',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
    } finally {
      setIsSaving(false);
    }
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
            disabled={isSaving}
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }} htmlFor="card-image">
            Imagem (opcional):
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-blue"
              disabled={isSaving}
              onClick={() => imageInputRef.current?.click()}
            >
              {selectedImageFile || form.image ? 'Alterar imagem' : 'Selecionar imagem'}
            </button>
            <input
              ref={imageInputRef}
              id="card-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isSaving}
              onChange={(event) => {
                handleImageSelection(event.currentTarget.files?.[0]);
                event.currentTarget.value = '';
              }}
              style={{ display: 'none' }}
            />
            <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
              JPEG, PNG, WebP ou GIF; máximo de 10 MB.
            </p>
            {(imagePreviewUrl || form.image) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img
                  src={imagePreviewUrl || form.image || undefined}
                  alt="Prévia da imagem do card"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '240px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-gray"
                  disabled={isSaving}
                  onClick={() => {
                    setSelectedImage(null);
                    setForm((currentForm) => ({ ...currentForm, image: null }));
                  }}
                >
                  Remover imagem
                </button>
              </div>
            )}
          </div>
        </div>

        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Alternativas:</p>
        {form.alternatives.map((alt, index) => (
          <div key={index} style={{ display: 'block', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="radio"
                name="correct-answer"
                checked={correctAnswerIndex === index}
                disabled={isSaving}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <input
                type="text"
                value={alt}
                onChange={(e) => handleAlternativeChange(index, e.target.value)}
                placeholder={`Alternativa ${index + 1}`}
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #3085d6',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                }}
              />
              <button
                type="button"
                className="btn btn-gray"
                aria-label={`Excluir alternativa ${index + 1}`}
                title="Excluir alternativa"
                disabled={isSaving || form.alternatives.length <= 2}
                onClick={() => handleRemoveAlternative(index)}
                style={{
                  width: '36px',
                  minWidth: '36px',
                  opacity: form.alternatives.length <= 2 ? 0.5 : 1,
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-green"
          disabled={isSaving || form.alternatives.length >= 5}
          onClick={handleAddAlternative}
          style={{
            width: 'auto',
            padding: '0 12px',
            opacity: form.alternatives.length >= 5 ? 0.5 : 1,
          }}
        >
          + Adicionar alternativa
        </button>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleClose}
            className="btn btn-gray"
            disabled={isSaving}
            style={{ padding: '8px 16px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn btn-blue"
            disabled={isSaving}
            style={{ padding: '8px 16px' }}
          >
            {isSaving && selectedImageFile ? 'Enviando imagem...' : isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
