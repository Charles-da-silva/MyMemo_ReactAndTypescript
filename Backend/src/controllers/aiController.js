const aiService = require('../services/aiService');
const importService = require('../services/importService');

async function generateFromPdf(req, res) {
  try {
    console.log('generateFromPdf called. File:', !!req.file, 'Body:', req.body);

    if (!req.file) {
      console.error('Erro: Nenhum arquivo foi enviado');
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const { questionCount } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname.replace('.pdf', '').replace(/\.pdf$/i, '');

    console.log('File info - mimetype:', req.file.mimetype, 'size:', fileBuffer.length, 'questionCount:', questionCount, 'fileName:', fileName);

    // Validações
    if (!questionCount || isNaN(questionCount) || questionCount < 1 || questionCount > 100) {
      console.error('Erro: Número de questões inválido:', questionCount);
      return res.status(400).json({
        error: 'Número de questões deve estar entre 1 e 100'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      console.error('Erro: Arquivo não é PDF:', req.file.mimetype);
      return res.status(400).json({
        error: 'Apenas arquivos PDF são aceitos'
      });
    }

    if (fileBuffer.length > parseInt(process.env.MAX_FILE_SIZE || 10485760)) {
      console.error('Erro: Arquivo muito grande:', fileBuffer.length);
      return res.status(400).json({
        error: 'Arquivo muito grande (máximo 10MB)'
      });
    }

    console.log('Iniciando extração de texto do PDF...');
    // Etapa 1: Extrair texto do PDF
    const pdfText = await aiService.extractPdfText(fileBuffer);

    if (!pdfText || pdfText.trim().length === 0) {
      console.error('Erro: PDF não contém texto extraível');
      return res.status(400).json({
        error: 'PDF não contém texto extraível'
      });
    }

    console.log('Texto extraído:', pdfText.substring(0, 100), '...');
    console.log('Iniciando geração de cards com Groq...');

    // Etapa 2: Gerar cards com Groq
    const geminiResponse = await aiService.generateCardsWithGemini(
      pdfText,
      parseInt(questionCount),
      fileName
    );

    console.log('Resposta do Groq recebida. Validando...');
    console.log('Primeiro card antes da validação:', {
      next_review: geminiResponse.cards[0]?.next_review,
      created_at: geminiResponse.cards[0]?.created_at
    });

    // Etapa 3: Validar resposta
    aiService.validateGeminiResponse(geminiResponse);

    console.log('Validação completa. Primeiro card depois da validação:', {
      next_review: geminiResponse.cards[0]?.next_review,
      created_at: geminiResponse.cards[0]?.created_at
    });

    // Etapa 4: Importar decks e cards
    const importResult = await importService.validateAndImportDecksCards(geminiResponse);

    if (!importResult.success) {
      console.error('Erro ao importar:', importResult.errors);
      return res.status(400).json({
        error: 'Erro ao importar decks e cards',
        details: importResult.errors,
      });
    }

    const deckName = geminiResponse.decks[0]?.name || 'Deck Importado';
    const deckId = geminiResponse.decks[0]?.id;

    console.log('Sucesso! Deck importado:', deckId);

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
