import { useState } from "react";
import Swal from 'sweetalert2';
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
    <div className="studyCard" >
      <br />

      <p className="personText largeText" style={{
        width: '90%',
        margin: '0 auto',
        fontSize: 'clamp(20px, 6vw, 20px)'
      }}>
        Execute os passos abaixo para criar seu deck de perguntas usando IA
      </p>
      <br />

      <button
        onClick={handleCopyPrompt}
        className="btn btn-blue"
        style={{
          marginBottom: '20px',
          fontSize: 'clamp(12px, 3vw, 14px)'
        }}
      >
        {copied ? '✓ Copiado!' : 'Copiar Prompt'}
      </button>

      <br />

      <div style={{
        backgroundColor: '#2a2a2a',
        padding: 'clamp(15px, 4vw, 10px)',
        borderRadius: '8px',
        width: '90%',
        textAlign: 'left',
        margin: '0 auto'
      }}>
        
        <ol  style={{
          textAlign: 'left',
          lineHeight: '1.6',
          fontSize: 'clamp(10px, 3vw, 10px)',
          padding: '0 20px'
        }}>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Clique no botão</strong> "Copiar Prompt" acima
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Abra um novo chat em sua IA de preferência</strong> (ChatGPT, Claude, Gemini, etc)
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Cole o prompt</strong> no chat (botão direito → colar como texto)
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Anexe no chat o arquivo</strong> PDF ou Word que contém o conteúdo que deseja estudar (a maioria das IAs suporta anexos, mas se a sua não suportar, tente outra IA. Indicamos Gemini) 
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Aguarde a IA gerar o arquivo JSON</strong> e faça download do arquivo gerado (a maioria das IAs tem opção de baixar o arquivo, mas se a sua não tiver, copie e cole o conteúdo do JSON em um editor de texto e salve como .json)
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <strong>Volte aqui no app</strong> e na na tela inicial importe o arquivo 
          </li>
        </ol>
      </div>

      

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
