require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');

const express = require("express");
const cors = require("cors");

require("./database/connection");

const cardsRoutes = require("./routes/cardsRoutes");
const decksRoutes = require("./routes/decksRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  fs.appendFileSync('requests.log', `${new Date().toISOString()} ${req.method} ${req.path}\n`);
  next();
});

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