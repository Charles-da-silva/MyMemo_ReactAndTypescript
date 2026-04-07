import { loadDecks } from "../storage/storage";
import type { Deck } from "../types/types";
import { useState } from "react";

interface HomeCardProps {
  setMode: (mode: "select" | "review" | "createDeck") => void;
}

export default function HomeCard({ setMode }: HomeCardProps) {

const [selectedDeckId, setSelectedDeckId] = useState("");
const [selectedDecksToExport, setSelectedDecksToExport] = useState<string[]>([]);
const [decks, setDecks] = useState<Deck[]>(loadDecks());

  return (
    <>
      <p className="personText largeText">Selecione um Deck para estudar ou gerenciar</p>
      <br />
      
      <select id="select-deck" value={selectedDeckId} onChange={(e) => {
          const id = e.target.value;
          setSelectedDeckId(id);
          setSelectedDecksToExport([id]);
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
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px", alignContent: "center", justifyContent: "center" }}>
        <button className="btn btn-blue" 
          onClick={() => setMode("createDeck")}>Criar</button>
        <button className="btn btn-gray" 
          onClick={() => setMode("createDeck")}>Importar</button>
      </div>
    </>
  );
}