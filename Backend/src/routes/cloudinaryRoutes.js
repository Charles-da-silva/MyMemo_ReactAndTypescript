const crypto = require("crypto");
const express = require("express");

const router = express.Router();

router.get("/signature", (req, res) => {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } =
    process.env;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({
      error: "O envio de imagens não está configurado no servidor.",
    });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "mymemo/cards";
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  res.set("Cache-Control", "no-store");
  return res.json({ cloudName, apiKey, timestamp, folder, signature });
});

module.exports = router;
