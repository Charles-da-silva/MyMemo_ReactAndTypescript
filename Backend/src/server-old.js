require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');

const express = require("express");
const cors = require("cors");

require("./database/connection");
const initializeDatabase = require("./database/initializeDatabase");
const requireAuth = require("./middleware/requireAuth");

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
app.use("/decks", requireAuth, decksRoutes);
app.use("/cards", requireAuth, cardsRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao preparar o banco de dados:', error);
    process.exitCode = 1;
  });