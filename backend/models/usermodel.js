const mongoose=require('mongoose')
const jwt=require('jsonwebtoken');
require('dotenv').config()
const secretkey=process.env.KEY;

const Userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    secretanswer:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    }
})

//generate token

Userschema.methods.generatetoken=function(){
    try {
        let usertoken=jwt.sign({_id:this._id}, secretkey);
        return usertoken;
    } catch (error) {
        console.log(error);
    }
}

const Usermodel=mongoose.model("User", Userschema);
module.exports=Usermodel;