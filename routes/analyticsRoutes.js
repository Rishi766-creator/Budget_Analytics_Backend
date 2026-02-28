const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const {monthlySummary,categoryBreakdown,trend6Months}=require("../controllers/analyticsController");
router.get("/monthly",auth,monthlySummary);
router.get("/category",auth,categoryBreakdown);
router.get("/trend6",auth,trend6Months);
module.exports=router;