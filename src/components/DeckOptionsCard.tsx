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
const { exportDecks } = useDeckImportExport({
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
      <br />
      <p className="personText largeText">O que deseja fazer?</p>
      <br /><br />
      
     
      {console.log("Decks selecionados para exportação:", selectedDecksToExport)}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)",  
        alignItems: "center", 
        gap: "10px", 
        alignContent: "center", 
        justifyContent: "center" 
        }}>
        
        <button 
            onClick={() => exportDecks(selectedDecksToExport)} 
            className="btn btn-blue" >Estudar
        </button> 
        <button 
            onClick={() => exportDecks(selectedDecksToExport)} 
            className="btn btn-green" >Editar
        </button>
        <button 
            onClick={() => exportDecks(selectedDecksToExport)} 
            className="btn btn-gray" >Exportar
        </button> 
        <button 
            onClick={() => exportDecks(selectedDecksToExport)} 
            className="btn btn-red" >Excluir
        </button> 
      </div>  
      <br /><br />       

      

      <img src="src\assets\home2.png" 
        alt="Voltar a home" height={30} onClick={() => setMode("home")} 
        style={{cursor: 'pointer', paddingTop: 15}}/>
    </>
  );
}