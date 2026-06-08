const { PDFParse } = require('pdf-parse');
const { randomUUID } = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function extractPdfText(fileBuffer) {
  try {
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

async function generateCardsWithGemini(text, questionCount, fileName = 'Deck Importado') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
10. Gere exatamente ${questionCount} perguntas de múltipla escolha.
11. Cada pergunta deve possuir exatamente 5 alternativas que façam sentido e realmente testem o conhecimento do estudante.
12. Apenas uma alternativa deve estar correta, mas as demais devem provocar dúvida se são ou não corretas.
13. Varie a posição da alternativa correta entre as 5 opções.
14. As alternativas incorretas devem ser plausíveis, porém incorretas de acordo com o documento.
15. Não repita perguntas.
16. Não repita alternativas desnecessariamente.
17. Toda resposta correta deve estar explicitamente fundamentada no conteúdo do PDF.

Conteúdo do PDF:
${text}

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Resposta vazia do Gemini');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      let jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : responseText;

      if (!jsonMatch) {
        const objMatch = responseText.match(/\{[\s\S]*\}/);
        jsonStr = objMatch ? objMatch[0] : jsonStr;
      }

      jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1').trim();

      try {
        jsonData = JSON.parse(jsonStr);
      } catch (e) {
        console.error('JSON parsing failed. Response preview:', responseText.substring(0, 500));
        throw new Error(`Resposta do Gemini não contém JSON válido: ${e.message}`);
      }
    }

    const deckId = randomUUID();
    const now = new Date().toISOString();

    return {
      version: 1,
      exportedAt: Date.now(),
      decks: [
        {
          id: deckId,
          name: fileName,
          description: 'Deck importado via PDF',
          created_at: now
        }
      ],
      cards: jsonData.cards.map(card => ({
        id: randomUUID(),
        deck_id: deckId,
        question: card.question,
        correct_answer: card.correct_answer,
        alternatives: card.alternatives,
        next_review: now,
        created_at: now,
        image: null
      }))
    };
  } catch (error) {
    throw new Error(`Erro ao gerar cards com Gemini: ${error.message}`);
  }
}

function validateGeminiResponse(jsonData) {
  if (!jsonData.version) throw new Error('Campo "version" ausente');
  if (!jsonData.decks || !Array.isArray(jsonData.decks)) {
    throw new Error('Campo "decks" deve ser um array');
  }
  if (!jsonData.cards || !Array.isArray(jsonData.cards)) {
    throw new Error('Campo "cards" deve ser um array');
  }

  // Garantir que deck tem ID válido
  jsonData.decks.forEach((deck, index) => {
    if (!deck.id || typeof deck.id !== 'string' || deck.id.trim() === '') {
      deck.id = randomUUID();
    }
  });

  const deckId = jsonData.decks[0]?.id;
  const now = new Date().toISOString();

  jsonData.cards.forEach((card, index) => {
    if (!card.question) throw new Error(`Card ${index}: campo "question" ausente`);
    if (!card.correct_answer) throw new Error(`Card ${index}: campo "correct_answer" ausente`);
    if (!card.alternatives || card.alternatives.length !== 5) {
      throw new Error(`Card ${index}: deve ter exatamente 5 alternativas`);
    }
    if (!card.alternatives.includes(card.correct_answer)) {
      throw new Error(`Card ${index}: "correct_answer" não está em "alternatives"`);
    }

    // Garantir que card tem IDs válidos
    if (!card.id || typeof card.id !== 'string' || card.id.trim() === '' || !isValidUUID(card.id)) {
      card.id = randomUUID();
    }
    if (!card.deck_id || typeof card.deck_id !== 'string' || card.deck_id.trim() === '' || !isValidUUID(card.deck_id)) {
      card.deck_id = deckId;
    }

    // Sempre usar a data atual para next_review (para que cards apareçam imediatamente para estudo)
    card.next_review = now;
    if (!card.created_at) {
      card.created_at = now;
    }
  });

  return true;
}

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = {
  extractPdfText,
  generateCardsWithGemini,
  validateGeminiResponse,
};
