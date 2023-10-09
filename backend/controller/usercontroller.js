
const { hashpassword, comparePassword } = require('../middleware/helper');
const UserModel=require('../models/usermodel')
exports.register=async(req, res)=>{
    try {
        const {name, email, password, phone, secretanswer, address}=req.body;
        if(!name || !email || !password || !phone || !secretanswer || !address){
            return res.status(400).send("Please fill all field")
        }

        const user=await UserModel.findOne({email})
        if(user){
            return res.status(200).send("User Already Exists, Please Login!")
        }
        const hash=await hashpassword(password);
        const newuser=new UserModel({name, email, password:hash, phone, secretanswer, address});
        const usersave=await newuser.save();
        res.status(200).send({message:"User registered successfully", usersave});
        
        
    } catch (error) {
        res.status(400).send({message:"User Register Failed"}, error);
    }
}

//Login route function

exports.login=async(req, res)=>{
 try {
 const {email, password}=req.body;
 if(!email || !password){
    return res.status(400).send("Please fill all fields!")
 }   
 const user=await UserModel.findOne({email})
 if(!user){
    return res.status(400).send("User Not Exist, Please Register!")
 }
 const match=await comparePassword(password, user.password);
 if(!match){
    return res.status(400).send("Password is Incorrect!")
 }
  const token=await user.generatetoken();
  res.status(200).send({message:"User Login Successfully!", token, user})
 } catch (error) {
    res.status(400).send({message:"User Login failed", error});
 }
}

// forgotpassword

exports.forgotpassword=async(req, res)=>{
try {
    const {email, newpassword, secretanswer}=req.body;
    if(!email || !newpassword || !secretanswer){
     return res.status(400).send("Please fill all fields! ");
    }

    const user=await UserModel.findOne({email:email, secretanswer:secretanswer});
    if(!user){
        return res.status(400).send("User does not exists, Please Signup");
    }
    const hash=await hashpassword(newpassword);
    const updatedPassword=await UserModel.findByIdAndUpdate(user._id, {password:hash}, {new:true})
    res.status(200).send("Password Reset Sucessfully");
} catch (error) {
    res.status(400).send({message:"forgot password failed!", error})
}

}

//Edit user

exports.edituser=async(req, res)=>{
    try {
        const {name, email, phone, address}=req.body;
        if(!name || !email || !phone || !address){
            return res.status(400).send({message:"Please fill all fields"});
        }

        const updatedUser=await UserModel.findByIdAndUpdate(req.user._id, {name, email, phone, address}, {new:true})
        res.status(200).send({message:"User updated Successfully", updatedUser})
    } catch (error) {
        res.status(400).send({message:"user update failed", error})
    }
}