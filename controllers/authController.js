const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const path = require("path");


const User = require("../models/User");

const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name ||!email ||!password){
            return res.status(400).json({message:"All fields are required"});

        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"Email already registered"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        });
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN||"7d"}
        );
        return res.status(201).json({
            message:"User registered",
            token,
            user:{id:user._id,name:user.name,email:user.email},
        });

    }catch (e) {
  console.error("REGISTER ERROR FULL:", e);
  return res.status(500).json({ message: e.message || "Server error" });
}


}
const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"Email and Password are required"});

        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invaild credentials"});
        }
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN||"7d"}
        );
        return res.json({
            message:"Login successful",
            token,
            user:{id:user._id,name:user.name,email:user.email}
        })
    }catch(e){
        return res.json({message:"Server error",error:e.message});

    }
}
module.exports={register,login};