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

Retorne APENAS um arquivo de extensão .json válido (sem markdown, sem explicação) com a seguinte estrutura:
{
  "version": 1,
  "exportedAt": 1779371223569,
  "decks": [
    {
      "id": "46717e54-2097-4e65-b0e3-b6763cf881a3",
      "name": "Backend Junior - Versat (Sem Duplicatas) xxx",
      "description": "Deck importado",
      "created_at": "2026-05-21T04:07:08.867Z"
    }
  ],
  "cards": [
    {
      "id": "4dbd216d-8c91-4ec3-9e14-6723bf217bf8",
      "deck_id": "46717e54-2097-4e65-b0e3-b6763cf881a3",
      "question": "Ao desenvolver para uma AgTech internacional, qual a importância de tratar fusos horários no código?",
      "correct_answer": "Garantir que registros financeiros e logísticos (ERP) estejam corretos entre diferentes países",
      "alternatives": [
        "Nenhuma, pois o computador ajusta isso sozinho",
        "Apenas estética visual para o usuário final",
        "Garantir que registros financeiros e logísticos (ERP) estejam corretos entre diferentes países",
        "Evitar que o computador trave ao mudar o dia",
        "Aumentar a velocidade de processamento do banco de dados"
      ],
      "next_review": "2026-04-22T16:32:19.436Z",
      "created_at": "2026-05-21T04:07:09.052Z",
      "image": null
    },
    {
      "id": "1618bb19-1ca9-4bf5-86ad-89a33e5320a9",
      "deck_id": "46717e54-2097-4e65-b0e3-b6763cf881a3",
      "question": "Ao receber um feedback negativo em uma 'Code Review', qual a atitude esperada de um Junior na Versat?",
      "correct_answer": "Analisar os pontos, tirar dúvidas se necessário e aplicar as melhorias sugeridas",
      "alternatives": [
        "Justificar que o erro foi da ferramenta de desenvolvimento",
        "Analisar os pontos, tirar dúvidas se necessário e aplicar as melhorias sugeridas",
        "Ignorar as sugestões e fazer o merge assim mesmo",
        "Pedir para mudar de tarefa imediatamente",
        "Apagar o código e não entregar a tarefa"
      ],
      "next_review": "2026-04-22T16:32:19.436Z",
      "created_at": "2026-05-21T04:07:08.993Z",
      "image": null
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

      <p className="personText largeText" style={{ width: '80vw' }}>Criar Deck com IA</p>
      <br />

      <p className="personText mediumText" style={{ width: '85vw', textAlign: 'center', lineHeight: '1.6' }}>
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
        style={{ marginBottom: '20px' }}
      >
        {copied ? '✓ Copiado!' : 'Copiar Prompt'}
      </button>

      <br />

      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        width: '85vw',
        maxWidth: '500px',
        textAlign: 'left',
      }}>
        <p className="personText smallText" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
          Passos para seguir:
        </p>

        <ol style={{ marginLeft: '20px', lineHeight: '1.8', alignItems: 'left' }}>
          <li className="personText smallText" style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>Clique no botão</strong> "Copiar Prompt" acima
          </li>
          <li className="personText smallText" style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>Abra sua IA de preferência</strong> (ChatGPT, Claude, Gemini, etc)
          </li>
          <li className="personText smallText" style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>Cole o prompt</strong> no chat (botão direito → colar como texto)
          </li>
          <li className="personText smallText" style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>Anexe o arquivo</strong> PDF ou Word no chat
          </li>
          <li className="personText smallText" style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>salve o arquivo JSON</strong> que a IA gerar
          </li>
          <li className="personText smallText" style={{ textAlign: 'left' }}>
            <strong>Volte aqui</strong> e na tela inicial do app importe o arquivo de deck que a IA gerou para começar a estudar!
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
          paddingTop: 15
        }}
      />
    </div>
  );
}
