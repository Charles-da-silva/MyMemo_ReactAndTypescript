const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('crypto');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractPdfText(fileBuffer) {
  try {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

async function generateCardsWithGemini(text, questionCount) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      "id": "${uuidv4()}",
      "name": "Deck Importado",
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta do Gemini não contém JSON válido');
      }
      jsonData = JSON.parse(jsonMatch[0]);
    }

    return jsonData;
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

  jsonData.cards.forEach((card, index) => {
    if (!card.question) throw new Error(`Card ${index}: campo "question" ausente`);
    if (!card.correct_answer) throw new Error(`Card ${index}: campo "correct_answer" ausente`);
    if (!card.alternatives || card.alternatives.length !== 5) {
      throw new Error(`Card ${index}: deve ter exatamente 5 alternativas`);
    }
    if (!card.alternatives.includes(card.correct_answer)) {
      throw new Error(`Card ${index}: "correct_answer" não está em "alternatives"`);
    }
  });

  return true;
}

module.exports = {
  extractPdfText,
  generateCardsWithGemini,
  validateGeminiResponse,
};
