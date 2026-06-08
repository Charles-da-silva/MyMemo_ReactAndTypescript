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

  const [cards] =
    useState<Card[]>([]);

  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [decksLoaded, setDecksLoaded] = useState(false);

  async function loadDecks() {
    setIsLoadingDecks(true);
    try {
      const apiDecks =
        await getDecks();

      setDecks(apiDecks);
      setDecksLoaded(true);
    } catch (error) {
      console.error(error);
      setDecksLoaded(true);
    } finally {
      setIsLoadingDecks(false);
    }
  }

  const { importDecks } =
    useDeckImportExport({
      decks,
      cards,
      loadDecks
    });

  useEffect(() => {
    // Não carrega automaticamente, aguarda clique do usuário
  }, []);


  return (
    <>
      <div padding-top="10px" justify-content="center" align-items="center" className="homeCard">

      {!decksLoaded ? (
        <>
          <p className="personText largeText">Clique no botão abaixo para carregar os decks existentes.</p>
          <br />
          <button
            onClick={loadDecks}
            disabled={isLoadingDecks}
            className="btn btn-blue"
            style={{ opacity: isLoadingDecks ? 0.5 : 1 }}
          >
            {isLoadingDecks ? 'Carregando...' : 'Carregar Decks'}
          </button>
        </>
      ) : isLoadingDecks ? (
        <p className="personText mediumText" style={{ color: '#888' }}>Carregando decks... aguarde.</p>
      ) : (
        <>
          <p className="personText largeText">Selecione um Deck para estudar ou gerenciar</p>
          <br />
          <select id="select-deck" value={selectedDeckId} onChange={(e) => {
              const id = e.target.value;
              setSelectedDeckId(id);
              setSelectedDeck([id]);
              setMode("deckOptions");

            }}>
            <option value="">Lista de Decks disponíveis</option>
            {decks.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </>
      )}
      
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