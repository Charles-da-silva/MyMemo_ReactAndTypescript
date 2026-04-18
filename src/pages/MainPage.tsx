import { useState } from "react";
import Logo from "../components/Logo";
import "../styles/index.css";
import HomeCard from "../components/HomeCard";
import HowCreateCard from "../components/HowCreateCard";
import DeckOptionsCard from "../components/DeckOptionsCard";
import StudyCard from "../components/StudyCard";

export default function MainPage() {

const [mode, setMode] = useState<"home" | "deckOptions" | "createDeck" | "review" | "editDeck">("home");
const [selectedDeck, setSelectedDeck] = useState<string[]>([]);

return (
  <>
  <div className="mainPage" style={{
    border: mode === "review" ? "0px" : "",       
    overflowY: mode === "review" ? "auto" : "hidden", // Scroll aparece quando o texto exceder a tela    
    justifyContent: mode === "review" ? "flex-start" : "center",    
  }}>
      
    <main className="conteudo-da-pagina"
      style={{
        border: mode === "review" ? "5px" : "",}}>

      {mode === "home" && (
        <>
          <div style={{marginBottom: 80}}>
            <Logo />
          </div>
          <HomeCard 
            setMode={setMode} 
            setSelectedDeck={setSelectedDeck} // passa o setter
          /> 
        </>       
      )}

      {mode === "createDeck" && (
        <>
          <HowCreateCard setMode={setMode} />
        </>        
      )}

      {mode === "deckOptions" && (
        <>
          <div style={{marginBottom: 80}}>
            <Logo />
          </div>
          <DeckOptionsCard 
            mode={mode}
            setMode={setMode} 
            selectedDeck={selectedDeck} // passa o valor
          />
        </>
      )}

      {mode === "review" && (
        <>
          <StudyCard 
            mode={mode}
            setMode={setMode}            
            selectedDeckId={selectedDeck[0]} // passa o ID do deck selecionado 
          />
        </>
      )}

    </main>
  </div>
  </>
);
}