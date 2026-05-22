import type { Card, Deck } from "../types/types";
import { useEffect, useState } from "react";

import { useDeckImportExport } from "../hooks/useDeckImportExport";

import { getDecks } from "../services/decksService";

interface HomeCardProps {
  setMode: (
    mode:
      | "home"
      | "deckOptions"
      | "createDeck"
  ) => void;

  setSelectedDeck: (
    ids: string[]
  ) => void;
}

export default function HomeCard({
  setMode,
  setSelectedDeck
}: HomeCardProps) {

  const [
    selectedDeckId,
    setSelectedDeckId
  ] = useState("");

  const [decks, setDecks] =
    useState<Deck[]>([]);

  const [cards, setCards] =
    useState<Card[]>([]);

  async function loadDecks() {

    try {

      const apiDecks =
        await getDecks();

      setDecks(apiDecks);

    } catch (error) {

      console.error(error);
    }
  }

  const { importDecks } =
    useDeckImportExport({
      decks,
      cards,
      setDecks,
      setCards,
      loadDecks
    });

  useEffect(() => {
    loadDecks();
  }, []);


  return (
    <>
      <div padding-top="10px" justify-content="center" align-items="center" className="homeCard">
      <p className="personText largeText">Selecione um Deck para estudar ou gerenciar</p>
      <br />
      
      <select id="select-deck" value={selectedDeckId} onChange={(e) => {
          const id = e.target.value;
          setSelectedDeckId(id);
          setSelectedDeck([id]);           
          setMode("deckOptions"); // MainPage renderizará o DeckOptionsCard com a prop setSelectedDeckId, 
          // que atualiza o estado selectedDeckId aqui. Assim, quando o usuário seleciona um deck, 
          // o modo é alterado para "deckOptions" e o DeckOptionsCard é renderizado, recebendo o ID do 
          // deck selecionado para que possa exibir as opções corretas.
                   
        }}>
        <option value="">Lista de Decks disponíveis</option>
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

      </div>
    </>
  );
}