# 🎓 MyMemo - Projeto Extensionista com IA

Sistema completo de flashcards com repetição espaçada, agora com **criação automática de decks usando GROQ AI**, **criação manual** e **edição completa de cards**.

---

## 📦 O que foi Implementado

### ✨ Novo: Criação Automática com IA (PDF → GROQ)
- Upload de PDF
- Extração automática de texto
- Geração inteligente de questões via GROQ AI
- Validação robusta de dados
- Importação automática para o banco
- **Controle da quantidade de questões** (1-100)

### ✨ Novo: Criação Manual Completa
- Cria novo deck (nome + descrição)
- Fluxo para adicionar múltiplos cards
- Modal reutilizável para criar cards
- Salva tudo em uma transação

### ✨ Novo: Edição Completa de Cards
- Editar pergunta
- Editar alternativas
- Alterar resposta correta
- Modal de edição integrado

### ✨ Novo: Criação de Cards Durante Edição
- Botão "+ Adicionar Card" no EditDeck
- Mesmo modal funciona para criar e editar
- Cards aparecem imediatamente na lista

---

## 🚀 Como Usar

### Instalar & Iniciar

```bash
# Backend
cd Backend
npm install
# Configure GROQ_API_KEY em .env
npm start

# Frontend (outro terminal)
cd Frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---

### Fluxo 1: Criar com IA (PDF)

1. "Criar Deck" → "Criar com IA"
2. Selecione um PDF
3. Defina quantidade de questões (slider 1-100)
4. Clique "Gerar com IA"
5. ✅ Deck + cards criados automaticamente

**Validações:**
- PDF obrigatório
- Quantidade entre 1-100
- Resposta correta em alternativas
- 5 alternativas por pergunta

---

### Fluxo 2: Criar Manualmente

1. "Criar Deck" → "Manualmente"
2. Digite nome e descrição
3. "Criar Deck"
4. "+ Adicionar Card"
5. Preencha pergunta + 5 alternativas
6. Selecione resposta correta
7. "Salvar"
8. Repita cards quantas vezes quiser
9. "Finalizar Deck"

---

### Fluxo 3: Editar Deck & Cards

1. Selecione deck na tela inicial
2. Clique ícone lápis em um card para editar
3. Modifique e clique "Salvar"
4. Ou clique lixeira para excluir
5. "+ Adicionar Card" para novos cards

---

## 🛠️ Stack Técnico

### Backend
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **GROQ AI** - IA para gerar questões
- **pdf-parse** - Extração de texto
- **Multer** - Upload de arquivos
- **Node.js** - Runtime

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **SweetAlert2** - Modais elegantes

---

## 📁 Estrutura de Arquivos

```
Backend/
├── .env                    # Configurações (GROQ_API_KEY)
├── src/
│   ├── server.js
│   ├── controllers/
│   │   └── aiController.js        # Novo: Endpoint IA
│   ├── services/
│   │   ├── aiService.js           # Novo: PDF + GROQ
│   │   └── importService.js       # Novo: Validação
│   ├── routes/
│   │   └── aiRoutes.js            # Novo: Rotas IA
│   └── database/
│       └── connection.js          # Atualizado: Env vars

Frontend/
├── src/
│   ├── pages/
│   │   └── MainPage.tsx           # Atualizado: Novos modos
│   ├── components/
│   │   ├── AIDeckCreationCard.tsx      # Novo
│   │   ├── ManualDeckCreationCard.tsx  # Novo
│   │   ├── CardEditorModal.tsx         # Novo
│   │   ├── HowCreateCard.tsx           # Atualizado
│   │   └── EditDeckCard.tsx            # Atualizado
│   └── services/
│       ├── aiService.ts           # Novo
│       └── cardsService.ts        # Atualizado

TESTING.md                 # Guia completo de testes
```

---

## 🔑 Configuração Necessária

### 1. GROQ_API_KEY

Obtenha em: https://aistudio.google.com/app/apikeys

```bash
# Backend/.env
GROQ_API_KEY=sua_chave_aqui
```

### 2. PostgreSQL

Deve estar rodando na porta 5432 com:
- Database: `MyMemoDB`
- User: `postgres`
- Password: `senha123`

---

## 📊 API Endpoints

### Nova Rota IA

**POST** `/ai/generate-from-pdf`
```json
{
  "file": "multipart/form-data",
  "questionCount": 10
}
```

Response:
```json
{
  "success": true,
  "deckId": "uuid",
  "deckName": "Deck Importado",
  "cardCount": 10
}
```

### Rotas Existentes

- `GET /decks` - Todos os decks
- `POST /decks` - Criar deck
- `PUT /decks/:id` - Atualizar deck
- `DELETE /decks/:id` - Deletar deck
- `GET /cards/:deckId` - Cards do deck
- `POST /cards` - Criar card
- `PUT /cards/:id` - Atualizar card ✨ NOVO
- `DELETE /cards/:id` - Deletar card
- `PATCH /cards/:id/review` - Atualizar revisão

---

## ✅ Validações Implementadas

### Frontend
- ✓ Arquivo PDF obrigatório
- ✓ Número de questões 1-100
- ✓ 5 alternativas obrigatórias
- ✓ Resposta correta em alternativas
- ✓ Pergunta e descrição não vazias

### Backend
- ✓ Tipo de arquivo (PDF apenas)
- ✓ Tamanho máximo (10MB)
- ✓ PDF com texto extraível
- ✓ JSON válido do GROQ
- ✓ Alternativas contêm resposta
- ✓ Cards têm deck_id válido

---

## 🧪 Testes

Veja `TESTING.md` para guia completo com:
- Teste de criação com IA
- Teste de criação manual
- Teste de edição
- Teste de exclusão
- Teste de error handling
- Testes de API

---

## 🎨 UX/UI

- Dark theme coerente
- Modais intuitivos
- Spinners durante processamento
- Feedback visual com SweetAlert2
- Slider para quantidade de questões
- Radio buttons para resposta correta

---

## 🐛 Troubleshooting

**Erro: "Cannot find module 'pg'"**
```bash
cd Backend && npm install pg
```

**Erro: "GROQ_API_KEY not set"**
```bash
# Backend/.env
GROQ_API_KEY=sua_chave_aqui
```

**Erro: "PostgreSQL connection refused"**
```bash
# Inicie PostgreSQL (Mac)
brew services start postgresql
```

---

## 📝 Próximas Melhorias Sugeridas

- [ ] Suporte para Word/DOCX files
- [ ] Batch import de múltiplos PDFs
- [ ] Retry automático com backoff GROQ
- [ ] Preview de cards antes de salvar
- [ ] Edição em massa de cards
- [ ] Histórico de revisões
- [ ] Temas customizáveis

---

## 👨‍💼 Autor

Implementado para projeto extensionista da faculdade com foco em **repetição espaçada + IA generativa**.

**Tecnologias:** React, TypeScript, Node.js, PostgreSQL, GROQ AI

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho extensionista.
