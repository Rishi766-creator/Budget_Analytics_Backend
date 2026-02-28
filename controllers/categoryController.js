const path = require("path");

const resolvedPath = require.resolve("../models/Category");
console.log("RESOLVED CATEGORY MODEL PATH:", resolvedPath);

const Category = require("../models/Category");
console.log("DEBUG Category typeof:", typeof Category);
console.log("DEBUG Category keys:", Object.keys(Category));

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "name and type are required" });
    }

    const category = await Category.create({
      user: req.user.userId,
      name,
      type,
    });

    return res.status(201).json(category);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    console.log(e.message);
    return res.status(500).json({ message:e.message });
  }
};

const listCategories = async (req, res) => {
  try {
    const filter = { user: req.user.userId };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const categories = await Category.find(filter).sort({ name: 1 });

    return res.json(categories);
  } catch (e) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name || category.name;

    await category.save();

    return res.json(category);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category deleted" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
};
