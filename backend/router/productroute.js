const express=require('express');
const route=express.Router();
const upload=require('../middleware/uploads');
const { authlogin, Admin }=require('../middleware/userauth');
const { Addproduct, Allproduct, singleproduct, Editproduct, Deleteproduct, braintreetokenfunction, braintreepaymentfunction } = require('../controller/Productcontroller');

route.post("/addproduct", upload.single("img"),authlogin, Admin, Addproduct )
route.get("/allproduct", Allproduct)
route.get("/singleproduct/:id", singleproduct);
route.put("/editproduct/:id", upload.single("img"),authlogin, Admin,Editproduct);
route.delete("/deleteproduct/:id", authlogin, Admin, Deleteproduct)
route.get("/braintree/token", braintreetokenfunction)
route.post("/braintree/payment", authlogin, braintreepaymentfunction)

module.exports=route;