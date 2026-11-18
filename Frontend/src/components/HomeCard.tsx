import type { Card, Deck } from "../types/types";
import { useCallback, useEffect, useState } from "react";

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

  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [decksLoaded, setDecksLoaded] = useState(false);
  const [decksError, setDecksError] = useState<string | null>(null);

  const loadDecks = useCallback(async () => {
    try {
      const apiDecks = await getDecks();
      setDecks(apiDecks);
      setDecksError(null);
      setDecksLoaded(true);
    } catch (error) {
      console.error(error);
      setDecksError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado ao carregar os decks.",
      );
      setDecksLoaded(true);
    } finally {
      setIsLoadingDecks(false);
    }
  }, []);

  const { importDecks } =
    useDeckImportExport({
      decks,
      cards,
      loadDecks
    });

  useEffect(() => {
    let active = true;

    getDecks()
      .then(apiDecks => {
        if (active) {
          setDecks(apiDecks);
          setDecksError(null);
          setDecksLoaded(true);
          setIsLoadingDecks(false);
        }
      })
      .catch(error => {
        console.error(error);
        if (active) {
          setDecksError(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao carregar os decks.",
          );
          setDecksLoaded(true);
          setIsLoadingDecks(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function retryLoadDecks() {
    setIsLoadingDecks(true);
    setDecksError(null);
    void loadDecks();
  }


  return (
    <>
      <div padding-top="10px" justify-content="center" align-items="center" className="homeCard">

      {isLoadingDecks ? null : decksError ? (
        <>
          <p className="personText mediumText" role="alert" style={{ color: '#b00020' }}>
            Não foi possível carregar os decks: {decksError}
          </p>
          <button onClick={retryLoadDecks} className="btn btn-blue">
            Tentar novamente
          </button>
        </>
      ) : decksLoaded ? (
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
      ) : null}
      
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
      <br /><br />
      <a className="content-link" target="_blank" style={{ textDecoration: "none", fontSize: "12px" }} href="https://github.com/Charles-da-silva/MyMemo_ReactAndTypescript/blob/feature-backend-node/README.md">Sobre o MyMemo</a>
      <br />
    </>
  );
}