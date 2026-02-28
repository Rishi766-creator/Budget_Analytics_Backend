const express=require("express");
const connectDB=require("./config/db");
const cors = require("cors");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
const expenseRoutes=require("./routes/expenseRoutes");
const analyticsRoutes=require("./routes/analyticsRoutes");
const categoryRoutes=require("./routes/categoryRoutes");
const budgetRoute = require("./routes/budgetRoute");

dotenv.config();

const app=express();
app.use(
  cors({
    origin:[ "http://localhost:5173","https://budget-analytics-frontend-gx29.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();
console.log(typeof categoryRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/budget", budgetRoute);
app.use("/api/expenses",expenseRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/categories",categoryRoutes);
app.get("/health",(req,res)=>{
    res.json({message:true});
})
app.listen(5000,()=>{
    console.log("Server running on port 5000");
})
