const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getBudget, upsertBudget } = require("../controllers/budgetController");

router.get("/", auth, getBudget);
router.put("/", auth, upsertBudget);

module.exports = router;