const syncService = require("../services/syncService");

async function getChanges(req, res) {
  const since = req.query.since ?? "0";
  const full = req.query.full === "true";
  if (
    typeof since !== "string" ||
    !/^\d+$/.test(since) ||
    (req.query.full !== undefined &&
      req.query.full !== "true" &&
      req.query.full !== "false")
  ) {
    return res.status(400).json({ error: "Cursor de sincronização inválido." });
  }

  try {
    const changes = await syncService.getChanges(req.user.uid, since, full);
    res.json(changes);
  } catch (error) {
    if (error.code === "SYNC_CURSOR_AHEAD") {
      return res.status(409).json({ error: error.message });
    }

    console.error("Erro ao sincronizar decks e cards:", error);
    res.status(500).json({ error: "Erro ao sincronizar decks e cards." });
  }
}

module.exports = {
  getChanges
};
