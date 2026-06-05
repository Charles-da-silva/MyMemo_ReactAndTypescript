const { PDFParse } = require('pdf-parse');
const { randomUUID } = require('crypto');
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

async function generateCardsWithGroq(text, questionCount, fileName = 'Deck Importado') {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const prompt = `Analise o texto abaixo e gere exatamente ${questionCount} perguntas de múltipla escolha com 5 alternativas cada.
Para cada pergunta, a resposta correta deve estar em posição aleatória entre as 5 alternativas.
A resposta correta DEVE estar exatamente igual em uma das alternativas.

Texto para análise:
"""
${text}
"""

Retorne APENAS um JSON válido (sem markdown, sem código, sem explicação extra):
{
  "version": 1,
  "exportedAt": ${Date.now()},
  "decks": [
    {
      "id": "${randomUUID()}",
      "name": "${fileName}",
      "description": "Deck importado via PDF",
      "created_at": "${new Date().toISOString()}"
    }
  ],
  "cards": [ARRAY DE CARDS COM ESTRUTURA ABAIXO]
}

Cada card deve ter esta estrutura exatamente:
{
  "id": "<uuid>",
  "deck_id": "<uuid do deck acima>",
  "question": "<pergunta>",
  "correct_answer": "<texto exato da resposta correta>",
  "alternatives": ["<alt1>", "<alt2>", "<alt3>", "<alt4>", "<alt5>"],
  "next_review": "${new Date().toISOString()}",
  "created_at": "${new Date().toISOString()}",
  "image": null
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error('Resposta vazia do Groq');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      let jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : responseText;

      // Try to find JSON object if not in markdown
      if (!jsonMatch) {
        const objMatch = responseText.match(/\{[\s\S]*\}/);
        jsonStr = objMatch ? objMatch[0] : jsonStr;
      }

      // Clean up common JSON issues
      jsonStr = jsonStr
        .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
        .trim();

      try {
        jsonData = JSON.parse(jsonStr);
      } catch (e) {
        console.error('JSON parsing failed. Response preview:', responseText.substring(0, 500));
        throw new Error(`Resposta do Groq não contém JSON válido: ${e.message}`);
      }
    }

    return jsonData;
  } catch (error) {
    throw new Error(`Erro ao gerar cards com Groq: ${error.message}`);
  }
}

function validateGroqResponse(jsonData) {
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
  generateCardsWithGroq,
  validateGroqResponse,
};
