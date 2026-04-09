import { loadCards, loadDecks } from "../storage/storage";
import type { Card, Deck } from "../types/types";
import { useState, useEffect } from "react";
import { useDeckImportExport } from "../hooks/useDeckImportExport";

interface DeckOptionsCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck") => void;
  selectedDecksToExport: string[]; // recebe o array pronto vindo do HomeCard
}

export default function DeckOptionsCard({ setMode, selectedDecksToExport: initialSelected  }: DeckOptionsCardProps) {

const [selectedDeckId, setSelectedDeckId] = useState(initialSelected[0] || ""); // Inicializa com o primeiro ID do array ou string vazia
const [selectedDecksToExport, setSelectedDecksToExport] = useState<string[]>(initialSelected);
const [decks, setDecks] = useState<Deck[]>(loadDecks());
const [cards, setCards] = useState<Card[]>(loadCards());
const { exportDecks, importDecks } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  // Sincroniza quando a prop initialSelected chegar/mudar
  useEffect(() => {
    if (initialSelected.length > 0) {
        setSelectedDeckId(initialSelected[0]);
        setSelectedDecksToExport(initialSelected);
    }
  }, [initialSelected]);

  return (
    <>
           
      <select id="select-deck" value={selectedDeckId} onChange={(e) => {
          const id = e.target.value;
          setSelectedDeckId(id);
          setSelectedDecksToExport([id]);
        }}>        
        {decks.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <p className="personText largeText">O que deseja fazer?</p>
      <br />
      
     
      {console.log("Decks selecionados para exportação:", selectedDecksToExport)}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", alignContent: "center", justifyContent: "center" }}>
        
         {/* "Botão" para Exportar Deck */} 
        <button 
            onClick={() => exportDecks(selectedDecksToExport)} 
            className="btn btn-blue" >Exportar
        </button>         

      </div>

      <img src="src\assets\home2.png" 
        alt="Voltar a home" height={30} onClick={() => setMode("home")} 
        style={{cursor: 'pointer', paddingTop: 15}}/>
    </>
  );
}