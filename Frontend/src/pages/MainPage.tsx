import { useState } from "react";
import Logo from "../components/Logo";
import "../styles/index.css";
import HomeCard from "../components/HomeCard";
import HowCreateCard from "../components/HowCreateCard";
import DeckOptionsCard from "../components/DeckOptionsCard";
import StudyCard from "../components/StudyCard";
import EditDeckCard from "../components/EditDeckCard";
import AIDeckCreationCard from "../components/AIDeckCreationCard";
import ManualDeckCreationCard from "../components/ManualDeckCreationCard";
import { useAuth } from "../contexts/authContext";
import Swal from "sweetalert2";

export default function MainPage() {

const { user, logOut } = useAuth();
const [mode, setMode] = useState<"home" | "deckOptions" | "createDeck" | "review" | "editDeck" | "aiDeckCreation" | "manualDeckCreation">("home");
const [selectedDeck, setSelectedDeck] = useState<string[]>([]);

async function handleLogOut() {
  try {
    await logOut();
  } catch (error) {
    console.error("Erro ao encerrar sessão:", error);
    await Swal.fire({
      title: "Erro",
      text: "Não foi possível encerrar a sessão. Tente novamente.",
      icon: "error",
      background: "#1E1E1E",
      color: "#fff",
    });
  }
}

return (
  <>
  <div className="mainPage" style={{
    border: mode === "review" ? "0px" : "",
    overflowY: mode === "review" ? "auto" : "hidden", // Scroll aparece quando o texto exceder a tela
    justifyContent: mode === "review" ? "flex-start" : "center",
  }}>
    <div className="account-actions">
      <span>{user?.displayName || user?.email}</span>
      <button type="button" onClick={handleLogOut}>Sair</button>
    </div>

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

      {mode === "aiDeckCreation" && (
        <>
          <AIDeckCreationCard setMode={setMode} />
        </>
      )}

      {mode === "manualDeckCreation" && (
        <>
          <ManualDeckCreationCard setMode={setMode} />
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
            selectedDeckId={selectedDeck[0]} // passa o ID do deck selecionado
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

      {mode === "editDeck" && (
        <>
          <EditDeckCard
            setMode={setMode}
            selectedDeck={selectedDeck} // passa o ID do deck selecionado
          />
        </>
      )}

    </main>
  </div>
  </>
);
}