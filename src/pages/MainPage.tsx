import { useState } from "react";
import Logo from "../components/Logo";
import "../styles/index.css";
import HomeCard from "../components/HomeCard";
import HowCreateCard from "../components/HowCreateCard";
import DeckOptionsCard from "../components/DeckOptionsCard";

export default function MainPage() {

const [mode, setMode] = useState<"home" | "deckOptions" | "createDeck">("home");
const [selectedDecksToExport, setSelectedDecksToExport] = useState<string[]>([]);


return (
  <>
  <div className="mainPage">
    
    <div className="container-logo">
      <Logo />
    </div>
    
    <main className="conteudo-da-pagina">

      {mode === "home" && (
        <HomeCard 
          setMode={setMode} 
          setSelectedDecksToExport={setSelectedDecksToExport} // passa o setter
        />        
      )}

      {mode === "createDeck" && (
        <HowCreateCard setMode={setMode} />
      )}

      {mode === "deckOptions" && (
        <DeckOptionsCard 
          setMode={setMode} 
          selectedDecksToExport={selectedDecksToExport} // passa o valor
        />
      )}

    </main>
  </div>  
  </>
);
}