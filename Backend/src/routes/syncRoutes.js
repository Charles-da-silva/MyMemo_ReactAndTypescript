const express = require("express");
const router = express.Router();
const syncController = require("../controllers/syncController");

router.get("/", syncController.getChanges);

module.exports = router;
