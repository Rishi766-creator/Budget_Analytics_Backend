const express = require("express");
const router = express.Router();
const path = require("path");
const auth=require("../middleware/auth");
const resolvedPath = require.resolve("../controllers/categoryController");
console.log("RESOLVED CONTROLLER PATH:", resolvedPath);


const controller = require("../controllers/categoryController");
console.log("DEBUG controller keys:", Object.keys(controller));

const { createCategory, listCategories, updateCategory, deleteCategory } = controller;


router.post("/", auth, createCategory);
router.get("/", auth, listCategories);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
