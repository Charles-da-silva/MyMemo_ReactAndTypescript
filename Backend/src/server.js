require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require("express");
const cors = require("cors");

require("./database/connection");

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

app.use("/decks", decksRoutes);
app.use("/cards", cardsRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
