import { useDeckImportExport } from "../hooks/useDeckImportExport";
import { loadCards, loadDecks, saveCards, saveDecks } from "../storage/storage";
import type { Card, Deck } from "../types/types";
import { useState, useRef } from "react";
import "../styles/index.css";
import editIcon from "../assets/Edit.png";
import trashIcon from "../assets/Trash.png";
import homeIcon from "../assets/home.png";
import Swal from 'sweetalert2';

interface EditCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "review" | "editDeck") => void;
  selectedDeck: string[]; // recebe o array pronto vindo do HomeCard
}

export default function EditDeckCard({ setMode, selectedDeck: initialSelected }: EditCardProps) {

  const [selectedDeckId] = useState(initialSelected[0] || "");

  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
  const [cards, setCards] = useState<Card[]>(() => loadCards());
  const { } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  const currentCards = cards.filter(c => c.deckId === selectedDeckId);

  // reference para o input de nome do deck, para facilitar a edição:
  const deckNameRef = useRef<HTMLInputElement>(null);

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

  function renameDeck() {
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
        icon: 'warning',
      });
      return;
    }

    const updatedDecks = decks.map(d =>
      d.id === selectedDeckId ? { ...d, name: novoNome } : d
    );

    setDecks(updatedDecks);
    saveDecks(updatedDecks);
    showPopUp({
      title: 'Sucesso',
      text: 'O deck foi renomeado com sucesso!',
      icon: 'success'
    });
  }

  function deleteCard(id: string) {

    // Remove do estado principal de todos os cards
    const updatedAllCards = cards.filter(c => c.id !== id);
    setCards(updatedAllCards);
    saveCards(updatedAllCards);

  }

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
          defaultValue={decks.find(d => d.id === selectedDeckId)?.name}
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
              <p style={{ fontSize: "16px", marginBottom: 10, textAlign: "left" }}>Este Deck possui {currentCards.length} cards</p>


              {currentCards.map((card: any) => (
                <li key={card.id}>
                  <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: "98%", border: "1px solid #eee", borderRadius: "12px", textAlign: "left", padding: "10px" }}>
                      <span className="line-clamp-3 text-sm text-gray-700">
                        {card.question}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, marginRight: 5 }}>
                      <img
                        src={editIcon}
                        alt="Editar card"
                        onClick={() => setMode("editDeck")}

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
                </li>
              ))}


            </div>
          </>

        ) : (
          <p className="text-gray-500 italic">Nenhum card neste deck.</p>
        )}


        <img src={homeIcon}
          alt="Voltar a home" height={40} onClick={() => setMode("home")}
          style={{ cursor: 'pointer', paddingTop: 15 }} />
        <br /><br />
      </div>
    </>
  );
}