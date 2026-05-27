import { useState } from "react";
import Swal from 'sweetalert2';
import { generateCardsFromPdf } from "../services/aiService";
import Logo from "./Logo";
import homeIcon from "../assets/home.png";
import "../styles/index.css";

interface AIDeckCreationCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "aiDeckCreation" | "manualDeckCreation") => void;
}

export default function AIDeckCreationCard({ setMode }: AIDeckCreationCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      Swal.fire({
        title: 'Erro',
        text: 'Por favor, selecione um arquivo PDF',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (questionCount < 1 || questionCount > 100) {
      Swal.fire({
        title: 'Erro',
        text: 'O número de questões deve estar entre 1 e 100',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateCardsFromPdf(file, questionCount);

      if (result.success) {
        await Swal.fire({
          title: 'Sucesso!',
          text: `Deck "${result.deckName}" criado com ${result.cardCount} cards!`,
          icon: 'success',
          background: '#1E1E1E',
          color: '#fff',
          confirmButtonColor: '#3085d6',
        });
        setMode("home");
      } else {
        Swal.fire({
          title: 'Erro',
          text: result.error || 'Erro ao processar o PDF',
          icon: 'error',
          background: '#1E1E1E',
          color: '#fff',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire({
        title: 'Erro',
        text: `${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="howCreateCard">
      <Logo />
      <br /><br />

      <p className="personText largeText" style={{ width: '80vw' }}>Criar Deck com IA</p>
      <br />

      <p className="personText mediumText">
        Envie um arquivo PDF e deixe a IA gerar perguntas e respostas automaticamente!
      </p>
      <br />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center',
        width: '80vw',
        maxWidth: '400px',
      }}>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          width: '100%',
          textAlign: 'left',
        }}>
          <span className="personText smallText" style={{ fontWeight: 'bold' }}>
            Arquivo PDF:
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #3085d6',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          />
          {file && (
            <p className="personText smallText" style={{ color: '#90EE90', marginTop: '5px' }}>
              ✓ {file.name}
            </p>
          )}
        </label>

        <label style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          width: '100%',
          textAlign: 'left',
        }}>
          <span className="personText smallText" style={{ fontWeight: 'bold' }}>
            Número de questões: {questionCount}
          </span>
          <input
            type="range"
            min="1"
            max="100"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            disabled={isLoading}
            style={{
              width: '100%',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          />
          <p className="personText smallText" style={{ color: '#888', fontSize: '12px' }}>
            (mínimo: 1, máximo: 100)
          </p>
        </label>
      </div>

      <br />

      <button
        onClick={handleGenerate}
        disabled={isLoading || !file}
        className="btn btn-blue"
        style={{
          opacity: isLoading || !file ? 0.5 : 1,
          cursor: isLoading || !file ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Processando... ⏳' : 'Gerar com IA'}
      </button>

      <br /><br />

      <img
        src={homeIcon}
        alt="Voltar"
        height={40}
        onClick={() => !isLoading && setMode("home")}
        style={{
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.5 : 1,
          paddingTop: 15
        }}
      />
    </div>
  );
}
