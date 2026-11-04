require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require("express");
const cors = require("cors");

const initializeDatabase = require("./database/initializeDatabase");
const requireAuth = require("./middleware/requireAuth");

const app = express();

app.use(express.json());
app.use(cors());

// Global middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.error(`GLOBAL: ${req.method} ${req.path}`, req.body);
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando!" });
});

const cardsRoutes = require("./routes/cardsRoutes");
const decksRoutes = require("./routes/decksRoutes");

app.use("/decks", requireAuth, decksRoutes);
app.use("/cards", requireAuth, cardsRoutes);

const PORT = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao preparar o banco de dados:', error);
    process.exitCode = 1;
  });
