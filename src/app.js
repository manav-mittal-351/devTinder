const express = require("express");
const app = express();

app.get("/user", (req,res)=>{
    res.send({firstName: "Manav", lastName: "Mittal" , age: "20", gender: "male"}); 
})

app.post("/user", (req,res)=>{
    res.send("Data get saved in database successfully!");
})

app.delete("/user", (req,res)=>{
    res.send("Data deleted successfully!");
})

app.patch("/user", (req,res)=>{
    res.send("Patched successfully!");
})

app.use("/user", (req,res)=>{
    res.send("Hello i am using middleware!!");
})

app.listen(5050, ()=>{
    console.log("Server get started on port number 5050!");
})