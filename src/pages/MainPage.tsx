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
    paddingTop: mode === "review" ? "110px" : "0px", // Remove a margem superior no modo de revisão
    overflowY: mode === "review" ? "auto" : "hidden", // Scroll aparece quando o texto exceder a tela
    maxHeight: "100vh", // Limita a altura à tela para a barra aparecer
    
    
  }}>
      
    <main className="conteudo-da-pagina"
      style={{
        border: mode === "review" ? "5px" : "",}}>

      {mode === "home" && (
        <>
          <div className="container-logo">
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
          <div className="container-logo">
            <Logo />
          </div>
          <HowCreateCard setMode={setMode} />
        </>        
      )}

      {mode === "deckOptions" && (
        <>
          <div className="container-logo">
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
            selectedDeck={selectedDeck}
            selectedDeckId={selectedDeck[0]} // passa o ID do deck selecionado 
          />
        </>
      )}

    </main>
  </div>
  </>
);
}