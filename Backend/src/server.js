// Importa o express (Framework para criar APIs)
const express = require("express");

// Importa o cors (Permite o React acessar o backend)
const cors = require("cors");

const cards = require("./data/cards");

// Cria a aplicação
const app = express();

// Permite receber JSON
app.use(express.json());

// Libera acesso do React
app.use(cors());

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "Backend funcionando!"
  });
});

app.get("/cards", (req, res) => {
  res.json(cards);
});

// Porta do servidor
const PORT = 3001;

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});