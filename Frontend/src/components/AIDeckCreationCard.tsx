import { useRef, useState } from "react";
import Swal from 'sweetalert2';
import homeIcon from "../assets/home.png";
import { useDeckImportExport } from "../hooks/useDeckImportExport";
import "../styles/index.css";

interface AIDeckCreationCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck" | "aiDeckCreation" | "manualDeckCreation") => void;
}

export default function AIDeckCreationCard({ setMode }: AIDeckCreationCardProps) {
  const [copied, setCopied] = useState(false);
  const importFileInput = useRef<HTMLInputElement>(null);

  const { importDecks } = useDeckImportExport({
    decks: [],
    cards: [],
    onImportSuccess: async () => {
      setMode("home");
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });
    },
  });

  const instructions = `Você receberá um arquivo de texto anexado.

Sua tarefa é analisar TODO o conteúdo do arquivo antes de criar qualquer pergunta.

Regras obrigatórias:

1. Leia 100% do conteúdo do arquivo de texto.
2. Não utilize conhecimento externo.
3. Não invente informações.
4. Não crie exemplos fictícios.
5. Todas as perguntas e respostas devem ser baseadas exclusivamente no conteúdo do texto.
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
17. Toda resposta correta deve estar explicitamente fundamentada no conteúdo do texto.
18. Gere ids aleatórios para o deck e seus cards, usando a data e hora de criação para formar o id que deve ficar no formato apresentado no json abaixo.
19. O "next_review" deve ser a mesma da hora de criação do deck, usando a hora do Brasil.
20. Ao final, gere um arquivo JSON para download seguindo exatamente as regras aqui descritas.
21. caso o arquivo de texto não seja enviado, solicite o envio e após o envio siga o processo descrito acima normalmente.
22. Se o arquivo for muito curto para 50 perguntas, informe ao usuário e questione quantas perguntas desela. Após a resposta dele, gere a quantidade de perguntas solicitada seguindo as regras acima.

O formato do JSON deve ser exatamente o seguinte (sem campos adicionais):

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

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(instructions);
    } catch {
      Swal.fire({
        title: 'Não foi possível copiar',
        text: 'Verifique as permissões de área de transferência do navegador e tente novamente.',
        icon: 'error',
        background: '#1E1E1E',
        color: '#fff',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    Swal.fire({
      title: 'Copiado!',
      text: 'Instruções copiadas para a área de transferência.',
      icon: 'success',
      background: '#1E1E1E',
      color: '#fff',
      confirmButtonColor: '#3085d6',
      timer: 2000,
    });
  };

  const handleCopyAndOpenGemini = async () => {
    window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');

    try {
      await navigator.clipboard.writeText(instructions);
    } catch {
      Swal.fire({
        title: 'Gemini aberto, mas as instruções não foram copiadas',
        text: 'Verifique as permissões de área de transferência do navegador. Você ainda pode usar “Copiar para outra IA” e colar o texto no Gemini.',
        icon: 'warning',
        background: '#1E1E1E',
        color: '#fff',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    Swal.fire({
      title: 'Gemini aberto!',
      text: 'As instruções foram copiadas. No Gemini, cole-as no chat (Ctrl+V) e anexe o arquivo de texto.',
      icon: 'success',
      background: '#1E1E1E',
      color: '#fff',
      confirmButtonColor: '#3085d6',
      timer: 3000,
    });
  };

  return (
    <div className="studyCard" >
      <div className="personText" style={{
        width: '90%',
        margin: '0 auto',
        maxWidth: '560px',
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        lineHeight: 1.5
      }}>
        <p style={{ margin: '0 0 10px' }}>
          Use a IA para criar o baralho de estudo (deck) e as perguntas de forma automatizada, você só precisa de um arquivo de texto, como um word ou um PDF (como criar PDF via seu celular).
        </p>
        <p style={{ margin: 0 }}>
          Se já possui o arquivo, leia as instruções abaixo ao menos uma vez e depois siga cada passo:
        </p>
      </div>
      <br />

      <div style={{
        backgroundColor: '#2a2a2a',
        padding: 'clamp(15px, 4vw, 10px)',
        borderRadius: '8px',
        width: '90%',
        textAlign: 'left',
        margin: '0 auto'
      }}>
        
        <ol style={{
          textAlign: 'left',
          lineHeight: '1.6',
          padding: '0 20px'
        }}>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Clique em <strong>“Copiar e abrir Gemini”</strong>. As instruções já terão sido copiadas e será aberta uma nova janela com a IA do Google (Gemini).
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            No chat com o Gemini, cole as instruções.
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Anexe o arquivo de texto que contém o conteúdo que deseja estudar.
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Baixe o arquivo que a IA gerar.
          </li>
          <li className="mediumText" style={{ marginBottom: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Volte aqui e clique em{' '}
            <button
              type="button"
              onClick={() => importFileInput.current?.click()}
              style={{
                padding: '2px 10px',
                border: '1px solid #3B82F6',
                borderRadius: '999px',
                background: '#3B82F6',
                color: '#fff',
                font: 'inherit',
                fontWeight: 'bold',
                lineHeight: 1.5,
                cursor: 'pointer',
                verticalAlign: 'middle'
              }}
            >
              Importar
            </button>
            <input
              ref={importFileInput}
              type="file"
              accept="application/json"
              onChange={importDecks}
              style={{ display: 'none' }}
            />
          </li>
        </ol>
        <div style={{
          margin: '20px auto',
          textAlign: 'center',
          fontSize: 'clamp(12px, 3vw, 14px)',
          lineHeight: 1.8
        }}>
          <a href="https://youtu.be/i0FgvbR6iS8" target="_blank" rel="noopener noreferrer">
            Como criar decks usando IA
          </a>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          width: '90%',
          margin: '0 auto',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleCopyAndOpenGemini}
            className="btn btn-blue"
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontSize: 'clamp(12px, 3vw, 14px)'
            }}
          >
            Copiar e abrir Gemini
          </button>
          <button
            onClick={handleCopyInstructions}
            className="btn btn-blue"
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontSize: 'clamp(12px, 3vw, 14px)',
              backgroundColor: '#555'
            }}
          >
            {copied ? '✓ Instruções copiadas' : 'Copiar para outra IA'}
          </button>
        </div>
        <p style={{
          margin: '12px auto 0',
          textAlign: 'center',
          fontSize: 'clamp(11px, 3vw, 13px)',
          lineHeight: 1.5
        }}>
          Em caso de erros, envie um e-mail para{' '}
          <a href="mailto:emaildocharles@gmail.com">emaildocharles@gmail.com</a>
        </p>
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
