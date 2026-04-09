import { loadCards, loadDecks } from "../storage/storage";
import type { Card, Deck } from "../types/types";
import { useState } from "react";
import { useDeckImportExport } from "../hooks/useDeckImportExport";
import DeckOptionsCard from "./DeckOptionsCard";

interface HomeCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck") => void;
  setSelectedDecksToExport: (ids: string[]) => void; // prop nova
}

export default function HomeCard({ setMode, setSelectedDecksToExport }: HomeCardProps) {

const [selectedDeckId, setSelectedDeckId] = useState("");

const [decks, setDecks] = useState<Deck[]>(loadDecks());
const [cards, setCards] = useState<Card[]>(loadCards());
const { importDecks } = useDeckImportExport({
    decks,
    cards,
    setDecks,
    setCards
  });

  return (
    <>
      <p className="personText largeText">Selecione um Deck para estudar ou gerenciar</p>
      <br />
      
      <select id="select-deck" value={selectedDeckId} onChange={(e) => {
          const id = e.target.value;          
          setMode("deckOptions"); // MainPage renderizará o DeckOptionsCard com a prop setSelectedDeckId, 
          // que atualiza o estado selectedDeckId aqui. Assim, quando o usuário seleciona um deck, 
          // o modo é alterado para "deckOptions" e o DeckOptionsCard é renderizado, recebendo o ID do 
          // deck selecionado para que possa exibir as opções corretas.
          setSelectedDeckId(id);
          setSelectedDecksToExport([id]);
          console.log("Enviando para DeckOptionsCard:", [id]); // confira aqui
        }}>
        <option value="">Lista de Decks disponíveis</option>
        <option value="" style={{width: "10px"}}>Lista de Decks disponíveisLista de Decks disponíveis</option>
        {decks.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      
      <br /><br /><br />      
      <p className="personText largeText">Crie ou importe um Deck</p>
      <br /> 
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px", 
        alignContent: "center", justifyContent: "center" }}>

        <button className="btn btn-blue" 
          onClick={() => setMode("createDeck")}>Criar</button>

        {/* "Botão" para Importar Deck */} 
        <div>
          <label 
            htmlFor="file-upload" // Associa o label ao input abaixo
            className="btn btn-gray" 
            style={{ 
            display: "block",            
            alignContent: "center",            
            cursor: "pointer",
            width: "124px", 
            height: "39px",       
            }}>Importar
          </label>
          
          <input
            id="file-upload"
            type="file"
            accept="application/json"
            onChange={importDecks}
            style={{ display: 'none' }} // Esconde o input feio
          />
        </div>

      </div>
    </>
  );
}