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

  const instructions = `Você atuará como um especialista em avaliação educacional e elaboração de questões de alto nível.
Você receberá um ou mais arquivos (texto, PDF ou imagem) em anexo. Sua tarefa é analisar integralmente o material e criar um deck de flashcards de múltipla escolha em formato JSON para download.

### FLUXO DE EXECUÇÃO OBRIGATÓRIO
1. **Verificação:** Caso nenhum arquivo seja enviado, solicite o envio. Se algum arquivo estiver ilegível, corrompido ou sem texto extraível (OCR), avise imediatamente antes de gerar qualquer pergunta.
2. **Mapeamento:** Leia 100% do conteúdo útil (desconsidere capa, ficha catalográfica, sumário, prefácio, agradecimentos, glossário e referências bibliográficas). Mapeie todos os capítulos/seções relevantes e distribua proporcionalmente as 50 perguntas entre eles, sem deixar nenhum tópico relevante de fora.
3. **Volume:** Gere exatamente 50 perguntas. Se o material for muito curto para gerar 50 questões sem repetir conceitos ou criar perguntas triviais, informe o limite do texto e proponha uma quantidade menor adequada antes de gerar o arquivo.
4. **Entrega:** Ao final, gere e disponibilize o arquivo .json para download seguindo rigorosamente o schema especificado.

### REGRAS DE ELABORAÇÃO (NÍVEL MÉDIO A DIFÍCIL)
- **Fidelidade ao material:** Toda pergunta e sua correct_answer devem estar 100% fundamentadas no conteúdo explícito do(s) arquivo(s). Não invente fatos nem crie exemplos fictícios que não estejam no texto.
- **Profundidade cognitiva:** Priorize compreensão de conceitos, definições, processos, relações de causa e consequência, comparações entre temas e aplicações práticas descritas no texto. Evite perguntas triviais ou de mera decoreba literal.
- **Alternativas (Distratores):**
  - Cada questão deve ter entre 4 e 5 alternativas (ou 2 a 5 quando o conceito for estritamente binário), sem repetir opções.
  - Apenas UMA alternativa deve ser correta.
  - As alternativas incorretas devem ser altamente plausíveis, técnicas e coerentes com o tema (usando termos e conceitos do próprio material, mas apresentando inversões, generalizações indevidas ou confusões conceituais), evitando alternativas absurdas ou obviamente erradas.
  - Varie equilibradamente a posição (índice) da resposta correta ao longo do deck.
- **Unicidade:** Não repita perguntas nem aborde exatamente o mesmo ponto duas vezes.

### REGRAS TÉCNICAS DO JSON E DATAS
- **IDs:** Gere identificadores únicos no formato UUID padrão (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx), incorporando o carimbo de data/hora de criação. O deck_id de todos os cards deve corresponder ao id do deck.
- **Datas e Fuso Horário:** Utilize a data e hora atual no fuso horário de Brasília (America/Sao_Paulo, UTC-3) para created_at e exportedAt (timestamp em milissegundos). O campo next_review de todos os cards deve ser exatamente igual ao created_at do deck.
- **Estrutura:** Siga exatamente o formato abaixo, sem adicionar, remover ou renomear campos:

{
  "version": 1,
  "exportedAt": 1779371223569,
  "decks": [
    {
      "id": "46717e54-2097-4e65-b0e3-b6763cf881a3",
      "name": "Nome descritivo baseado no material",
      "description": "Deck importado",
      "created_at": "2026-05-21T04:07:08.867Z"
    }
  ],
  "cards": [
    {
      "id": "4dbd216d-8c91-4ec3-9e14-6723bf217bf8",
      "deck_id": "46717e54-2097-4e65-b0e3-b6763cf881a3",
      "question": "Ao desenvolver para uma AgTech internacional, qual é a principal implicação técnica de não tratar fusos horários na camada de persistência?",
      "correct_answer": "Inconsistência nos registros financeiros e logísticos (ERP) integrados entre diferentes países",
      "alternatives": [
        "Inconsistência nos registros financeiros e logísticos (ERP) integrados entre diferentes países",
        "Falha automática na sincronização do relógio interno do servidor de aplicação",
        "Bloqueio das consultas de leitura no banco de dados durante a virada de data UTC",
        "Alteração na precisão decimal dos cálculos monetários realizados pelo sistema",
        "Perda de compatibilidade com protocolos padrão de serialização de datas em APIs"
      ],
      "next_review": "2026-05-21T04:07:08.867Z",
      "created_at": "2026-05-21T04:07:09.052Z",
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

  const handleOpenGemini = () => {
    window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="studyCard">
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
            Clique em <strong>“Copiar instruções para IA”</strong> e depois em <strong>“Abrir Gemini”</strong>.
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
          <a className="content-link" href="https://youtu.be/i0FgvbR6iS8" target="_blank" rel="noopener noreferrer">
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
            onClick={handleCopyInstructions}
            className="btn btn-blue"
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontSize: 'clamp(12px, 3vw, 14px)'
            }}
          >
            {copied ? '✓ Instruções copiadas' : 'Copiar instruções para IA'}
          </button>
          <button
            onClick={handleOpenGemini}
            className="btn btn-blue"
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontSize: 'clamp(12px, 3vw, 14px)',
              backgroundColor: '#555'
            }}
          >
            Abrir Gemini
          </button>
        </div>
        <p style={{
          margin: '12px auto 0',
          textAlign: 'center',
          fontSize: 'clamp(11px, 3vw, 13px)',
          lineHeight: 1.5
        }}>
          Em caso de erros, envie um e-mail para{' '}
          <a className="content-link" href="mailto:emaildocharles@gmail.com">emaildocharles@gmail.com</a>
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
