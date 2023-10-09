const Productmodel=require('../models/Productmodels')
const Ordermodel=require('../models/Ordermodel');
const braintree=require('braintree');
require("dotenv").config();

//Payment Gateway
var gateway=new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId:process.env.Merchant_ID,
    publicKey:process.env.Public_Key,
    privateKey:process.env.Private_Key
})

exports.Addproduct=async(req, res)=>{
    try {
        const {name, description, category, price, quantity, shipping}=req.body;
        const img=req.file.filename;
        if(!name || !description || !category || !price || !quantity || !img){
           return res.status(400).send("Please filled all your fields");
        }

        const newproduct=new Productmodel({name, description, category, price, quantity, shipping, img})

        const saveproduct=await newproduct.save();
        res.status(200).send({message:"Product Created Successfully", saveproduct})
    } catch (error) {
        res.status(404).send({error, message:"Error to create product"})
    }
}

exports.Allproduct=async(req, res)=>{
    try {
        const products=await Productmodel.find({}).sort({createdAt:-1})
        res.status(200).send({message:"All products get successfully", products})
    } catch (error) {
        res.status(400).send({message:"Error in get all products", error})       
    }

}

exports.singleproduct=async(req, res)=>{
    try {
        const {id}=req.params;
        const product=await Productmodel.findOne({_id:id});
        res.status(200).send({message:"Single product found", product})
    } catch (error) {
        res.status(400).send({message:"Error to get single product", error})
    }
}

exports.Editproduct=async(req, res)=>{
    try {
        const {id}=req.params;
        const {name, description, category, price, quantity, img}=req.body;
        const file=req.file?req.file.filename:img;
        const updateproduct=await Productmodel.findByIdAndUpdate({_id:id}, {name, description, category, price, quantity, img:file});
        res.status(200).send({message:"Product updated sucessfully", updateproduct})
    } catch (error) {
        res.status(400).send({message:"Error in update product", error})
    }
}

exports.Deleteproduct=async(req, res)=>{
    try {
        const {id}=req.params;
        const deleteproduct=await Productmodel.findByIdAndDelete({_id:id})
        res.status(200).send({message:"Product deleted Successfully", deleteproduct})
    } catch (error) {
        res.status(400).send({message:"Error in Product deletion", error})
    }
}

//braintree token function

exports.braintreetokenfunction=async(req, res)=>{
    try {
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err);
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}


exports.braintreepaymentfunction=async(req, res)=>{
    try {
        const {cart, nonce}=req.body;
        let total=0;
        cart.map((i)=>{
            total+=i.price;
        })
        let newtransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        }, function(error, result){
           if(result){
            const order=new Ordermodel({products:cart, payment:result, buyer:req.user._id}).save();
            res.json({ok:true});
           }
           else{
            res.status(500).send(error);
           }
        })
    } catch (error) {
        console.log(error)
    }
}