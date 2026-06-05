# 🧪 Guia de Testes - MyMemo AI Deck Creation

## ✅ Pré-requisitos

1. **PostgreSQL rodando** na porta 5432
2. **Variável de ambiente** `GROQ_API_KEY` preenchida em `.env`
3. **Node.js** v18+

## 🚀 Iniciar a Aplicação

### Terminal 1 - Backend
```bash
cd Backend
npm start
# ou: node src/server.js
```
Esperado: `Servidor rodando na porta 3001`

### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```
Esperado: Servidor Vite disponível em `http://localhost:5173`

## 📋 Testes Funcionais

### 1️⃣ Teste: Criação com IA (PDF)

**Pré-requisito:** Um arquivo PDF com texto
```bash
# Criar PDF de teste (Linux/Mac)
echo "
Python é uma linguagem de programação interpretada.
JavaScript é usado para programação web.
Databases armazenam dados.
APIs conectam sistemas.
" > test.pdf
```

**Passos:**
1. Acesse http://localhost:5173
2. Clique em "Criar Deck"
3. Selecione "Criar com IA"
4. Selecione o arquivo PDF
5. Defina número de questões (ex: 5)
6. Clique em "Gerar com IA"
7. **Esperado:** Sucesso! Deck criado com X cards

**Validações:**
- [ ] Erro se não selecionar PDF
- [ ] Erro se número fora do intervalo (1-100)
- [ ] Spinner durante processamento
- [ ] Mensagem de sucesso com card count
- [ ] Novo deck aparece na tela inicial

---

### 2️⃣ Teste: Criação Manual

**Passos:**
1. Clique em "Criar Deck"
2. Selecione "Manualmente"
3. Digite nome do deck: "Teste Manual"
4. Digite descrição: "Deck de teste"
5. Clique "Criar Deck"
6. Clique "+ Adicionar Card"
7. Preencha:
   - Pergunta: "Qual é a capital do Brasil?"
   - Alternativas: [Brasília, São Paulo, Rio de Janeiro, Bahia, Recife]
   - Resposta correta: Selecione "Brasília"
8. Clique "Salvar"
9. Clique "+ Adicionar Card" novamente (2º card)
10. Repita com outra pergunta
11. Clique "Finalizar Deck"

**Validações:**
- [ ] Erro se nome do deck vazio
- [ ] Modal abre corretamente
- [ ] Validação: 5 alternativas obrigatórias
- [ ] Validação: resposta correta selecionada
- [ ] Deck criado com todos os cards
- [ ] Deck aparece na tela inicial

---

### 3️⃣ Teste: Edição de Cards

**Pré-requisito:** Deck com cards já criado

**Passos:**
1. Clique no deck na tela inicial
2. Clique em "Editar Deck" (ou já estará na edição)
3. Clique no ícone de lápis em um card
4. Modifique a pergunta
5. Modifique uma alternativa
6. Selecione resposta correta diferente
7. Clique "Salvar"
8. **Esperado:** "Card atualizado!" → Card reflete mudanças

**Validações:**
- [ ] Modal abre com dados do card
- [ ] Mudanças são salvas no backend
- [ ] Mensagem de sucesso
- [ ] Card atualizado na lista

---

### 4️⃣ Teste: Exclusão de Cards

**Passos:**
1. No editDeck, clique no ícone de lixeira de um card
2. Confirme exclusão
3. **Esperado:** Card removido da lista

**Validações:**
- [ ] Diálogo de confirmação aparece
- [ ] Card removido se confirmar
- [ ] Card permanece se cancelar
- [ ] Card count decrementado

---

### 5️⃣ Teste: Erro Handling

**Teste 1 - Arquivo inválido:**
1. Tente fazer upload com arquivo .txt ao invés de .pdf
2. **Esperado:** Erro "Apenas arquivos PDF são aceitos"

**Teste 2 - PDF vazio:**
1. Crie um PDF sem conteúdo
2. Tente fazer upload
3. **Esperado:** Erro "PDF não contém texto extraível"

**Teste 3 - Sem GROQ_API_KEY:**
1. Remova/deixe vazio GROQ_API_KEY em .env
2. Tente gerar deck com IA
3. **Esperado:** Erro de autenticação do GROQ

---

## 🔍 Testes de API (Backend)

### Endpoint: POST /ai/generate-from-pdf

**Request válido:**
```bash
curl -X POST http://localhost:3001/ai/generate-from-pdf \
  -F "file=@test.pdf" \
  -F "questionCount=5"
```

**Response esperado:**
```json
{
  "success": true,
  "deckId": "uuid-aqui",
  "deckName": "Deck Importado",
  "cardCount": 5,
  "message": "1 deck(s) e 5 card(s) importados com sucesso!"
}
```

**Validações:**
- [ ] Status 201 em sucesso
- [ ] Status 400 para arquivo inválido
- [ ] Status 500 para erro do GROQ
- [ ] Resposta contém deckId e cardCount

---

## 📊 Checklist Final

- [ ] Backend inicia sem erros
- [ ] Frontend compila sem errors de TypeScript
- [ ] Criação com IA funciona
- [ ] Criação manual funciona
- [ ] Edição de cards funciona
- [ ] Exclusão de cards funciona
- [ ] Erros são tratados corretamente
- [ ] Cards aparecem no deck após criação
- [ ] Alternativas validadas (5 obrigatórias)
- [ ] Resposta correta em alternativas

---

## 🐛 Troubleshooting

### "PostgreSQL Connection Refused"
- Inicie PostgreSQL: `brew services start postgresql` (Mac) ou Windows Service

### "GROQ_API_KEY not set"
- Configure em `Backend/.env`:
```
GROQ_API_KEY=sua_chave_aqui
```

### "Module not found"
- Execute: `npm install` em ambas pastas

### "TypeError in CardEditorModal"
- Limpe cache: `rm -rf node_modules && npm install`

---

## 📝 Notas

- UUID é gerado no backend
- Datas em formato ISO 8601
- GROQ usa modelo `GROQ-1.5-flash`
- Máximo 10MB por PDF
- Máximo 100 questões por PDF
