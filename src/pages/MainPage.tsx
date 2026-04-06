import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import TextBig from "../components/TextBig";
import type { Deck, Card } from "../types/types";
import { loadDecks } from "../storage/storage";
import Button from "../components/Button";
import "../styles/index.css";

export default function MainPage() {

  const [mode, setMode] = useState<"select" | "review" | "createDeck">("select");

  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [selectedDecksToExport, setSelectedDecksToExport] = useState<string[]>([]);
  const [decks, setDecks] = useState<Deck[]>(loadDecks());
  
  return (
    <>
    <div style={{
      position: "relative", 
      background: "#16171D", 
      overflow: "hidden", 
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: "3px solid var(--border)",
      width: "95%",
      height: "95%",
    }}>
      

      {mode === "select" && (
        <>
          <Logo />
          
          <TextBig 
          text="Selecione um Deck para estudar ou gerenciar" 
          />
          <br />
          <select className="select-deck" 
              value={selectedDeckId} onChange={(e) => {
              const id = e.target.value;
              setSelectedDeckId(id);
              setSelectedDecksToExport([id]);
            }}>
            <option value=""> &nbsp;&nbsp;&nbsp;&nbsp; Lista de Decks disponíveis &nbsp;&nbsp;&nbsp;&nbsp; </option>
            {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <br />      
          <TextBig 
          text="Crie ou importe um Deck" 
          />
          <Button ButtonColor="blue" text="Criar" onClick={() => setMode("createDeck")}
          />
          <Button ButtonColor="gray" text="Importar" onClick={() => setMode("createDeck")}
          />

        </>
      )}

      {mode === "createDeck" && (
        <>
          <Logo />
          
          <TextBig 
          text="Crie um novo Deck" 
          />
        </>
      )}

    </div>
    </>
  );
}