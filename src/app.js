const express = require("express");
const app = express();

app.use("/homepage", (req,res)=>{
    res.send("Hello Manav Mittal!!");
})

app.use("/sample", (req,res)=>{
    res.send("Hello from the sample route page!!");
})

app.use("/test",(req,res)=>{
    res.send("Hello from the testing page!!");
})

app.listen(3000, ()=>{
    console.log("Server is working perfectly...");
})