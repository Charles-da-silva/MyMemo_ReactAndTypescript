// Importa o express (Framework para criar APIs)
const express = require("express");

// Importa o cors (Permite o React acessar o backend)
const cors = require("cors");

const cardsRoutes = require("./routes/cardsRoutes");
const decksRoutes = require("./routes/decksRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Backend funcionando!"
  });
});

// ROTAS
app.use("/decks", decksRoutes);

app.use("/cards", cardsRoutes);

app.use("/ai", aiRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});