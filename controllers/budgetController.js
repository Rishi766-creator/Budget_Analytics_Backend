const Budget = require("../models/Budget");

const getBudget = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: "year and month are required" });
    }

    const doc = await Budget.findOne({
      user: req.user.userId,
      year: Number(year),
      month: Number(month),
    });

    // return null if not set
    return res.json({ budget: doc || null });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const upsertBudget = async (req, res) => {
  try {
    const { year, month, limitAmount } = req.body;

    if (year == null || month == null || limitAmount == null) {
      return res.status(400).json({ message: "year, month, limitAmount are required" });
    }

    const y = Number(year);
    const m = Number(month);
    const limit = Number(limitAmount);

    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(limit)) {
      return res.status(400).json({ message: "Invalid values" });
    }
    if (m < 1 || m > 12) {
      return res.status(400).json({ message: "month must be 1-12" });
    }
    if (limit < 0) {
      return res.status(400).json({ message: "limitAmount must be >= 0" });
    }

    const doc = await Budget.findOneAndUpdate(
      { user: req.user.userId, year: y, month: m },
      { limitAmount: limit },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: "Budget saved", budget: doc });
  } catch (e) {
    // handle unique index race condition
    if (e.code === 11000) {
      return res.status(409).json({ message: "Budget already exists, try again" });
    }
    return res.status(500).json({ message: e.message });
  }
};

module.exports = { getBudget, upsertBudget };