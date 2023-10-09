const express=require('express');
const { register, login, forgotpassword, edituser } = require('../controller/usercontroller');
const route=express.Router();
const {authlogin, Admin}=require('../middleware/userauth')

route.post('/register', register)
route.post('/login', login);
route.post('/forgotpassword', forgotpassword)

route.get('/loginverify', authlogin, (req, res)=>{
    res.send({ok:"User Verify Successfully"})
})

route.get('/adminverify', authlogin, Admin, (req, res)=>{
    res.send({ok:"User verify successfully"})
})

route.put('/edit', authlogin, edituser)

module.exports=route;