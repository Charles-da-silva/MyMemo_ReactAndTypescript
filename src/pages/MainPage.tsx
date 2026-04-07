import { useState } from "react";
import Logo from "../components/Logo";
import "../styles/index.css";
import HomeCard from "../components/HomeCard";
import HowCreateCard from "../components/HowCreateCard";

export default function MainPage() {

const [mode, setMode] = useState<"select" | "review" | "createDeck">("select");


return (
  <>
  <div className="mainPage">
    
    <div className="container-logo">
      <Logo />
    </div>
    
    <main className="conteudo-da-pagina">

      {mode === "select" && (
        <HomeCard setMode={setMode} />        
      )}

      {mode === "createDeck" && (
        <HowCreateCard setMode={setMode} />
      )}

    </main>
  </div>  
  </>
);
}