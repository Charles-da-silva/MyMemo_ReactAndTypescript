import { useState } from "react";
import Swal from 'sweetalert2';
import Logo from "./Logo";
import homeIcon from "../assets/home.png";
import "../styles/index.css";

interface AIDeckCreationCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "aiDeckCreation" | "manualDeckCreation") => void;
}

export default function AIDeckCreationCard({ setMode }: AIDeckCreationCardProps) {
  const [copied, setCopied] = useState(false);

  const prompt = `Você receberá um arquivo PDF anexado.

Sua tarefa é analisar TODO o conteúdo do PDF antes de criar qualquer pergunta.

Regras obrigatórias:

1. Leia 100% do conteúdo do PDF.
2. Não utilize conhecimento externo.
3. Não invente informações.
4. Não crie exemplos fictícios.
5. Todas as perguntas e respostas devem ser baseadas exclusivamente no conteúdo do PDF.
6. Distribua as perguntas entre todos os capítulos, seções ou tópicos relevantes do documento.
7. Nenhuma seção relevante pode ficar sem cobertura.
8. Priorize conceitos, definições, processos, exemplos, aplicações e relações entre temas.
9. Evite perguntas e respostas triviais.
10. Gere exatamente 50 perguntas de múltipla escolha.
11. Cada pergunta deve possuir exatamente 5 alternativas que façam sentido e realmente testem o conhecimento do estudante.
12. Apenas uma alternativa deve estar correta, mas as demais devem provocar dúvida se são ou não corretas.
13. Varie a posição da alternativa correta entre as 5 opções.
14. As alternativas incorretas devem ser plausíveis, porém incorretas de acordo com o documento.
15. Não repita perguntas.
16. Não repita alternativas desnecessariamente.
17. Toda resposta correta deve estar explicitamente fundamentada no conteúdo do PDF.

Retorne APENAS um JSON válido (sem markdown, sem explicação) com a seguinte estrutura:
{
  "cards": [
    {
      "question": "pergunta aqui",
      "correct_answer": "resposta correta",
      "alternatives": ["opção 1", "opção 2", "resposta correta", "opção 4", "opção 5"]
    }
  ]
}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    Swal.fire({
      title: 'Copiado!',
      text: 'Prompt copiado para a área de transferência',
      icon: 'success',
      background: '#1E1E1E',
      color: '#fff',
      confirmButtonColor: '#3085d6',
      timer: 2000,
    });
  };

  return (
    <div className="howCreateCard">
      <Logo />
      <br /><br />

      <p className="personText largeText" style={{
        width: '90vw',
        maxWidth: '600px',
        margin: '0 auto',
        fontSize: 'clamp(24px, 6vw, 32px)'
      }}>
        Criar Deck com IA
      </p>
      <br />

      <p className="personText mediumText" style={{
        width: '90vw',
        maxWidth: '600px',
        textAlign: 'center',
        lineHeight: '1.6',
        fontSize: 'clamp(14px, 4vw, 18px)',
        margin: '0 auto'
      }}>
        Vamos usar a IA para criar perguntas automaticamente!
        <br /><br />
        Clique no botão abaixo para copiar o prompt que você irá usar em sua IA de preferência.
        <br /><br />
        Depois que clicar no botão, deverá colar o prompt (botão direito, colar como texto/colar) no chat da IA, anexando o PDF ou Word.
      </p>
      <br /><br />

      <button
        onClick={handleCopyPrompt}
        className="btn btn-blue"
        style={{
          marginBottom: '20px',
          fontSize: 'clamp(12px, 3vw, 14px)',
          padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 20px)'
        }}
      >
        {copied ? '✓ Copiado!' : 'Copiar Prompt'}
      </button>

      <br />

      <div style={{
        backgroundColor: '#2a2a2a',
        padding: 'clamp(15px, 4vw, 20px)',
        borderRadius: '8px',
        width: '90vw',
        maxWidth: '600px',
        textAlign: 'left',
        margin: '0 auto'
      }}>
        <p className="personText smallText" style={{
          fontWeight: 'bold',
          marginBottom: '15px',
          fontSize: 'clamp(14px, 3vw, 16px)'
        }}>
          Passos para seguir:
        </p>

        <ol style={{
          marginLeft: 'clamp(15px, 4vw, 20px)',
          lineHeight: '1.8',
          fontSize: 'clamp(12px, 3vw, 14px)'
        }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Clique no botão</strong> "Copiar Prompt" acima
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Abra sua IA de preferência</strong> (ChatGPT, Claude, Gemini, etc)
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Cole o prompt</strong> no chat (botão direito → colar como texto)
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Anexe o arquivo</strong> PDF ou Word no chat
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Copie o JSON</strong> que a IA gerar
          </li>
          <li>
            <strong>Volte aqui</strong> e importe o arquivo na tela inicial
          </li>
        </ol>
      </div>

      <br /><br />

      <img
        src={homeIcon}
        alt="Voltar"
        height={40}
        onClick={() => setMode("home")}
        style={{
          cursor: 'pointer',
          paddingTop: 15,
          width: 'clamp(30px, 8vw, 40px)',
          height: 'auto'
        }}
      />
    </div>
  );
}
