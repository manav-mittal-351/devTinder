const express = require("express");
const app = express();

app.use("/", (err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong!");
    }
})

app.get("/user/data", (req,res)=>{
    throw new Error("new error");
    res.send("user data sent!");
})
app.listen(3001, ()=>{
    console.log("Server started!");
})