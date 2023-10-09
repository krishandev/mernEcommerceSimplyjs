const express=require('express');
const app=express();
require('dotenv').config()
require('./dbconn/dbconn')
const port=process.env.PORT
const cors=require("cors")


const userroute=require('./router/userroute');
const productroute=require('./router/productroute');
app.use("/uploads", express.static("./uploads"))
app.use(express.json());
app.use(cors());
app.use(userroute)
app.use(productroute)


app.listen(port, ()=>{
    console.log(`Server Listening on Port ${port}`)
})