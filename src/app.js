const express = require("express");
const { adminAuth,userAuth } = require("./middlewares");
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


// app.get(/.*fly$/, (req,res,next)=>{}

// app.get(/ab+cd/, (req,res,next)=>{    
//     // res.send("Hiiiii...");
//     console.log("Hello Manav!");
//     next();
//     // res.send("i send the message");
// },
// (req,res,next)=>{
//     console.log("Second res!");
//     // res.send("Send second response to postman!");
//     next();
// },
// (req,res,next)=>{
//     console.log("third response");
//     next();
// },
// (req,res,next)=>{
//     console.log("Fourth response");
//     next();
//     // res.send("Fourth response get send!");
// },
// (req,res)=>{
//     console.log("Fifth response");
//     res.send("Fifth response get send!");
// }
// )


// app.use("/user", (req,res,next)=>{
//     console.log("Second Response");
//     res.send("Second response sent.!");
//     // next();
// })

// app.use("/user", (req,res,next)=>{
//     console.log("First response!");
//     next();    
// })

app.get("/admin/loggin", (req,res)=>{
    res.send("Admin get logged in!");
})

app.use("/admin", adminAuth);
app.get("/admin/getAllData", (req,res)=>{
    res.send("All data sent!");
})


app.get("/user/loggin", (req,res)=>{
    res.send("User get logged in!");
})

app.use("/user", userAuth);
app.get("/user/data", (req,res)=>{
    res.send("User data sent!");
})

app.listen(5050, ()=>{
    console.log("Server is started!");
})