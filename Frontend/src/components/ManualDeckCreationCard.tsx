import { useState } from "react";
import Swal from 'sweetalert2';
import { createDeck } from "../services/decksService";
import { createCard } from "../services/cardsService";
import CardEditorModal from "./CardEditorModal";
import Logo from "./Logo";
import homeIcon from "../assets/home.png";
import trashIcon from "../assets/Trash.png";
import "../styles/index.css";
import { v4 as uuidv4 } from 'uuid';

interface ManualDeckCreationCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "aiDeckCreation" | "manualDeckCreation") => void;
}

interface CardForm {
  id: string;
  deck_id: string;
  question: string;
  alternatives: string[];
  correct_answer: string;
  next_review: string;
  created_at: string;
  image: null;
}

export default function ManualDeckCreationCard({ setMode }: ManualDeckCreationCardProps) {
  const [step, setStep] = useState<'deck' | 'cards'>('deck');
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState<CardForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      Swal.fire({
        title: 'Erro',
        text: 'Nome do deck é obrigatório',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newDeck = await createDeck({
        name: deckName,
        description: deckDescription || '',
      });
      setDeckId(newDeck.id);
      setStep('cards');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao criar deck',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
    }
  };

  const handleAddCard = (cardData: CardForm) => {
    if (editingCardIndex !== null) {
      const updatedCards = [...cards];
      updatedCards[editingCardIndex] = cardData;
      setCards(updatedCards);
      setEditingCardIndex(null);
    } else {
      setCards([...cards, { ...cardData, id: uuidv4() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleEditCard = (index: number) => {
    setEditingCardIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveAllCards = async () => {
    if (cards.length === 0) {
      Swal.fire({
        title: 'Erro',
        text: 'Adicione pelo menos um card ao deck',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      for (const card of cards) {
        await createCard(card);
      }
      setIsSubmitting(false);
      Swal.fire({
        title: 'Sucesso!',
        text: `Deck criado com ${cards.length} card(s)!`,
        icon: 'success',
        background: '#1E1E1E',
        color: '#fff',
      });
      setMode('home');
    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao salvar cards',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
      });
    }
  };

  return (
    <div className="howCreateCard">
      <Logo />
      <br />

      {step === 'deck' ? (
        <>
          <p className="personText largeText" style={{ width: '80vw' }}>Criar Novo Deck</p>
          <br />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center',
            width: '80vw',
            maxWidth: '400px',
          }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              width: '100%',
              textAlign: 'left',
            }}>
              <span className="personText smallText" style={{ fontWeight: 'bold' }}>
                Nome do Deck:
              </span>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Digite o nome do deck"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #3085d6',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                }}
              />
            </label>

            <label style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              width: '100%',
              textAlign: 'left',
            }}>
              <span className="personText smallText" style={{ fontWeight: 'bold' }}>
                Descrição (opcional):
              </span>
              <textarea
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="Digite a descrição do deck"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #3085d6',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
              />
            </label>
          </div>

          <br />

          <button
            onClick={handleCreateDeck}
            disabled={isSubmitting}
            className="btn btn-green"
            style={{
              opacity: isSubmitting ? 0.5 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Criando...' : 'Criar Deck'}
          </button>
        </>
      ) : (
        <>
          <p className="personText largeText" style={{ width: '80vw' }}>Adicionar Cards</p>
          <p className="personText mediumText">Deck: <strong>{deckName}</strong></p>
          <br />

          {cards.length > 0 && (
            <div style={{
              width: '80vw',
              maxWidth: '600px',
              marginBottom: '15px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {cards.map((card, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  backgroundColor: '#2a2a2a',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontSize: '14px', color: '#fff' }}>
                      {card.question}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditCard(index)}
                    className="btn btn-blue"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Editar
                  </button>
                  <img
                    src={trashIcon}
                    alt="Deletar"
                    style={{ height: '20px', cursor: 'pointer' }}
                    onClick={() => handleDeleteCard(index)}
                  />
                </div>
              ))}
            </div>
          )}

          <p className="personText mediumText" style={{ marginBottom: '10px' }}>
            {cards.length} card(s) adicionado(s)
          </p>

          <button
            onClick={() => {
              setEditingCardIndex(null);
              setIsModalOpen(true);
            }}
            className="btn btn-blue"
            style={{ marginRight: '10px' }}
            disabled={isSubmitting}
          >
            + Adicionar Card
          </button>

          <button
            onClick={handleSaveAllCards}
            className="btn btn-green"
            disabled={cards.length === 0 || isSubmitting}
            style={{
              opacity: cards.length === 0 || isSubmitting ? 0.5 : 1,
              cursor: cards.length === 0 || isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Salvando...' : 'Finalizar Deck'}
          </button>
        </>
      )}

      <br /><br />

      <img
        src={homeIcon}
        alt="Voltar"
        height={40}
        onClick={() => !isSubmitting && setMode("home")}
        style={{
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.5 : 1,
          paddingTop: 15
        }}
      />

      <CardEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCardIndex(null);
        }}
        onSave={handleAddCard}
        initialCard={editingCardIndex !== null ? cards[editingCardIndex] : undefined}
        deckId={deckId}
      />
    </div>
  );
}
