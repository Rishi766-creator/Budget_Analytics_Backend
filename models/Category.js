const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.models.Category || mongoose.model("Category", CategorySchema);
