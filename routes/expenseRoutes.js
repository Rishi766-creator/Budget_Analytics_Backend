const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const {createExpense,listExpense,updateExpense,deleteExpense}=require("../controllers/expenseController");
router.post("/",auth,createExpense);
router.get("/",auth,listExpense);
router.put("/:id",auth,updateExpense);
router.delete("/:id",auth,deleteExpense);
module.exports=router;
