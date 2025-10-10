const express = require("express");
const app = express();


// Dynamic Routing
// app.get("/user/:name/:age/:gender", (req,res)=>{
//     const {name, age, gender} = req.params;
//     console.log(req.params);
//     res.send(
//         {
//             Name: `${name}`,
//             Age: `${age}`,
//             Gender: `${gender}`
//         }
//     )
// })



// Static Routing with query parameters
// app.get("/user", (req,res)=>{
//     const {name, age, gender} = req.query;
//     console.log(req.query);

//     res.send(
//         {
//             Name: `${name}`,
//             Age: `${age}`,
//             Gender: `${gender}`
//         }
//     ) 
// })


app.get(/.*fly$/, (req,res)=>{
    res.send("Hiiiii...");
})

app.listen(5050, ()=>{
    console.log("Server get started on port number 5050!");
})