const mongoose=require("mongoose");
const connectDB=async ()=>{
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECTED");

}
catch(e){
    console.error("MONGODB CONNECTION FAILED:",e.message);
    process.exit(1);
}
}
module.exports=connectDB;