import Logo from "./Logo";
import homeIcon from "../assets/home.png";
import "../styles/index.css";

interface HomeCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "aiDeckCreation" | "manualDeckCreation") => void;
}

export default function HowCreateCard({ setMode }: HomeCardProps) {

  return (
    <>
      <div className="howCreateCard" >

        <Logo />
        <br /><br />

        <p className="personText largeText" style={{ width: '80vw' }}>De que forma deseja criar o Deck?</p>
        <br /><br />

        <p className="personText mediumText">Uma forma inteligente e gratuita de usar a IA para criar um deck completo para você, com perguntas e respostas baseadas no tema que você escolher!
        </p>
        <br />


        <button className="btn btn-blue" onClick={() => setMode("aiDeckCreation")}>Criar com IA</button>
        <br /><br />

        <p className="personText mediumText">Crie manualmente todas as perguntas e alternativas.</p>
        <br />

        <button className="btn btn-gray" onClick={() => setMode("manualDeckCreation")}>Manualmente</button>
        <br />

        <img src={homeIcon}
          alt="Voltar a home" height={40} onClick={() => setMode("home")}
          style={{ cursor: 'pointer', paddingTop: 15 }} />
      </div>
      <br />
    </>
  );
}   