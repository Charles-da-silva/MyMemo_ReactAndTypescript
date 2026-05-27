const aiService = require('../services/aiService');
const importService = require('../services/importService');

async function generateFromPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const { questionCount } = req.body;
    const fileBuffer = req.file.buffer;

    // Validações
    if (!questionCount || isNaN(questionCount) || questionCount < 1 || questionCount > 100) {
      return res.status(400).json({
        error: 'Número de questões deve estar entre 1 e 100'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Apenas arquivos PDF são aceitos'
      });
    }

    if (fileBuffer.length > parseInt(process.env.MAX_FILE_SIZE || 10485760)) {
      return res.status(400).json({
        error: 'Arquivo muito grande (máximo 10MB)'
      });
    }

    // Etapa 1: Extrair texto do PDF
    const pdfText = await aiService.extractPdfText(fileBuffer);

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({
        error: 'PDF não contém texto extraível'
      });
    }

    // Etapa 2: Gerar cards com Gemini
    const geminiResponse = await aiService.generateCardsWithGemini(
      pdfText,
      parseInt(questionCount)
    );

    // Etapa 3: Validar resposta
    aiService.validateGeminiResponse(geminiResponse);

    // Etapa 4: Importar decks e cards
    const importResult = await importService.validateAndImportDecksCards(geminiResponse);

    if (!importResult.success) {
      return res.status(400).json({
        error: 'Erro ao importar decks e cards',
        details: importResult.errors,
      });
    }

    const deckName = geminiResponse.decks[0]?.name || 'Deck Importado';
    const deckId = geminiResponse.decks[0]?.id;

    res.status(201).json({
      success: true,
      deckId,
      deckName,
      cardCount: importResult.cardCount,
      message: `${importResult.deckCount} deck(s) e ${importResult.cardCount} card(s) importados com sucesso!`,
    });
  } catch (error) {
    console.error('Erro ao processar PDF:', error);

    res.status(500).json({
      success: false,
      error: 'Erro ao processar arquivo PDF',
      details: error.message,
    });
  }
}

module.exports = {
  generateFromPdf,
};
