import { useDeckImportExport } from "../hooks/useDeckImportExport";
import type { Card, Deck } from "../types/types";
import { useState, useRef, useEffect } from "react";
import "../styles/index.css";
import editIcon from "../assets/Edit.png";
import trashIcon from "../assets/Trash.png";
import homeIcon from "../assets/home.png";
import Swal from 'sweetalert2';
import { getCardsByDeckId, deleteCard as deleteCardService, createCard, updateCard } from "../services/cardsService";
import { getDecks, updateDeck } from "../services/decksService";
import CardEditorModal from "./CardEditorModal";
import { v4 as uuidv4 } from 'uuid';

interface EditCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeck: string[]; // recebe o array pronto vindo do HomeCard
}

export default function EditDeckCard({ setMode, selectedDeck: initialSelected }: EditCardProps) {

  const selectedDeckId = initialSelected[0];

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const { } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  const currentCards = cards.filter(c => c.deck_id === selectedDeckId);
  const currentDeck = decks.find(d => d.id === selectedDeckId);

  // reference para o input de nome do deck, para facilitar a edição:
  const deckNameRef = useRef<HTMLInputElement>(null);

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

  async function renameDeck() {
    const novoNome = deckNameRef.current?.value;

    if (!novoNome || !novoNome.trim()) {
      showPopUp({
        title: 'Nome inválido',
        text: 'Digite um nome válido para o deck.',
        icon: 'error'
      });
      return;
    }

    if (novoNome === decks.find(d => d.id === selectedDeckId)?.name) {
      showPopUp({
        title: 'Nome igual',
        text: 'Primeiro altere o nome do Deck no campo acima do botão Renomear.',
        icon: 'error',
      });
      return;
    }

    const updatedDecks = decks.map(d =>
      d.id === selectedDeckId ? { ...d, name: novoNome } : d
    );

    await setDecks(updatedDecks);

    const currentDeck =
      decks.find(
        d => d.id === selectedDeckId
      );

    await updateDeck(selectedDeckId, {
      name: novoNome,
      description:
        currentDeck?.description || ""
    });

    showPopUp({
      title: 'Sucesso',
      text: 'O deck foi renomeado com sucesso!',
      icon: 'success'
    });
  }

  async function deleteCard(id: string) {

    try {

      // remove no backend
      await deleteCardService(id);

      // remove no React
      const updatedAllCards =
        cards.filter(c => c.id !== id);

      setCards(updatedAllCards);

      showPopUp({
        title: 'Pronto!',
        text: 'O card foi excluído com sucesso!',
        icon: 'success'
      });

    } catch (error) {

      console.error(error);

      showPopUp({
        title: 'Erro',
        text: 'Erro ao excluir card.',
        icon: 'error'
      });
    }
  }

  async function handleSaveCard(cardData: any) {
    try {
      if (editingCardIndex !== null) {
        // Editar card existente
        await updateCard(cardData.id, cardData);
        const updatedCards = [...cards];
        updatedCards[editingCardIndex] = cardData;
        setCards(updatedCards);
      } else {
        // Criar novo card
        await createCard({
          ...cardData,
          id: uuidv4(),
        });
        setCards([...cards, cardData]);
      }

      showPopUp({
        title: 'Sucesso!',
        text: editingCardIndex !== null ? 'Card atualizado!' : 'Card criado!',
        icon: 'success',
      });
    } catch (error) {
      console.error(error);
      showPopUp({
        title: 'Erro',
        text: 'Erro ao salvar card',
        icon: 'error',
      });
    }
  }

  useEffect(() => {
    async function loadCards() {
      try {
        const apiCards =
          await getCardsByDeckId(
            selectedDeckId
          );
        setCards(apiCards);
      } catch (error) {
      console.error(error);
      }
    }

    if (selectedDeckId) {
      loadCards();
    }
  }, [selectedDeckId]);


  useEffect(() => {
    async function loadDecks() {
      try {
        const apiDecks =
          await getDecks();
        setDecks(apiDecks);
      } catch (error) {
        console.error(error);
      }
    }
    loadDecks();
  }, []);

  return (
    <>
      <div className="studyCard" style={{
        flex: 1, // Ocupa o espaço disponível
        overflowY: "auto", // Habilita a rolagem vertical
        maxHeight: "100%", // Ajuste conforme a altura do seu app
        paddingRight: "5px",

        padding: "10px"
      }}>

        <p style={{ fontSize: "20px", marginBottom: 10, textAlign: "left" }}>Nome do Deck</p>

        <input
          key={selectedDeckId} // O 'key' força o input a resetar o valor quando mudar o deck no select
          ref={deckNameRef}
          defaultValue={currentDeck?.name || ""} // Exibe o nome do deck selecionado
          placeholder="Novo nome do deck"
          className="input-deck-name"
        />
        <div className="btn-card">
          <button
            onClick={renameDeck}
            className="btn btn-green"
            style={{ width: "35%", maxWidth: "150px" }}
          >
            Renomear
          </button>

          <button
            onClick={() => setMode("review")}
            className="btn btn-blue"
            style={{ width: "35%", maxWidth: "150px" }}
          >
            Estudar
          </button>

        </div>


        {currentCards.length > 0 ? (
          <>
            <div style={{ marginTop: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontSize: "16px", margin: 0, textAlign: "left" }}>Este Deck possui {currentCards.length} cards</p>
                <button
                  onClick={() => {
                    setEditingCardIndex(null);
                    setIsModalOpen(true);
                  }}
                  className="btn btn-green"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  + Adicionar Card
                </button>
              </div>

              {currentCards.map((card: any) => (
                <div key={card.id}>
                  <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div className="options" style={{ width: "98%", border: "1px solid #eee", borderRadius: "12px", textAlign: "left", padding: "10px" }}>
                      <span className="line-clamp-3 text-sm text-gray-700" >
                        {card.question}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, marginRight: 5 }}>
                      <img
                        src={editIcon}
                        alt="Editar card"
                        onClick={() => {
                          setEditingCardIndex(currentCards.indexOf(card));
                          setIsModalOpen(true);
                        }}
                        style={{ height: 20, cursor: "pointer" }} />
                      <img
                        src={trashIcon}
                        alt="Excluir card"
                        onClick={() =>
                          showPopUp({
                            title: 'Atenção',
                            text: 'Deseja realmente excluir esta pergunta permanentemente?',
                            icon: 'warning',
                            action: () => deleteCard(card.id),
                            confirmButtonText: 'Sim, excluir!'
                          })}
                        style={{ height: 20, cursor: "pointer" }} />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </>

        ) : (
          <>
            <p className="text-gray-500 italic" style={{ marginTop: 20, marginBottom: 10 }}>Nenhum card neste deck.</p>
            <button
              onClick={() => {
                setEditingCardIndex(null);
                setIsModalOpen(true);
              }}
              className="btn btn-green"
              style={{ marginBottom: 20 }}
            >
              + Adicionar Primeiro Card
            </button>
          </>
        )}


        <img src={homeIcon}
          alt="Voltar a home" height={40} onClick={() => setMode("home")}
          style={{ cursor: 'pointer', paddingTop: 15 }} />
        <br /><br />
      </div>

      <CardEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCardIndex(null);
        }}
        onSave={handleSaveCard}
        initialCard={editingCardIndex !== null ? currentCards[editingCardIndex] : undefined}
        deckId={selectedDeckId}
      />
    </>
  );
}