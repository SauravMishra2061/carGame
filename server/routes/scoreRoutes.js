const express = require("express");

const { updateHighScore } = require("../controllers/scoreController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/highscore", protect, updateHighScore);

module.exports = router;