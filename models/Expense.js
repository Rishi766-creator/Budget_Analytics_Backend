const mongoose=require("mongoose");
const ExpenseSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["expense","income"],default:"expense"},
    amount:{type:Number,required:true,min:0},
    category:{type:String,required:true,trim:true},
    date:{type:Date,required:true},
    note:{type:String,trim:true,default:""},
    paymentMethod:{
        type:String,
        enum:["cash","upi","card","bank","other"],
        default:"upi"
    },
},{timestamps:true});
module.exports=mongoose.model("Expense",ExpenseSchema);