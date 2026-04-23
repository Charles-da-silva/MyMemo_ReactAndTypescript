import Logo from "./Logo";
import homeIcon from "../assets/home.png";
import "../styles/index.css";
import Swal from 'sweetalert2';

interface HomeCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck") => void;
}

export default function HowCreateCard({ setMode }: HomeCardProps) {

  const showPopUp = ({ title, text, icon, action, confirmButtonText }: any) => {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      stopKeydownPropagation: true,
      title,
      text,
      icon,
      background: '#1E1E1E',
      color: '#fff',
      backdrop: 'rgba(0,0,0,0.8)',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText || 'OK',
      cancelButtonText: 'Cancelar',
      showCancelButton: !!action, // Só mostra cancelar se houver uma ação
    }).then((result) => {
      if (result.isConfirmed && action) action();
    });
  };

  return (
    <>
      <div className="howCreateCard" >

        <Logo />
        <br /><br />

        <p className="personText largeText" style={{ width: '80vw' }}>De que forma deseja criar o Deck?</p>
        <br />

        <p className="personText mediumText">Importe arquivos de texto em PDF ou Word e
          deixe a IA criar todas as perguntas e respostas para você!
        </p>
        <br />


        <button className="btn btn-blue" onClick={() => 
          showPopUp({
            title: 'Quase pronta...',
            text: 'Esta funcionalidade ainda está em desenvolvimento, mas em breve você poderá criar seus decks com a ajuda da IA por aqui!',
            icon: 'warning',
            confirmButtonText: 'OK'
          })}>Criar com IA</button>
        <br /><br />

        <p className="personText mediumText">Crie manualmente todas as perguntas e alternativas.</p>
        <br />

        <button className="btn btn-gray" onClick={() => 
          showPopUp({
            title: 'Quase pronta...',
            text: 'Esta funcionalidade ainda está em desenvolvimento, mas em breve você poderá criar seus decks manualmente por aqui!',
            icon: 'warning',
            confirmButtonText: 'OK'
          })}>Manualmente</button>
        <br />

        <img src={homeIcon}
          alt="Voltar a home" height={40} onClick={() => setMode("home")}
          style={{ cursor: 'pointer', paddingTop: 15 }} />
      </div>
      <br />
    </>
  );
}   