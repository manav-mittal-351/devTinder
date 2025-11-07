//my chnages

const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user")


// app.post("/signUp", async (req,res) => {
// const user = new User({
//     firstName: "Manav",
//     lastName: "Mittal",
//     email: "manav@gmail.com",
//     password: "manav@123"
// });
// await user.save();
// });


app.post("/signUp", async (req,res) => {
    const user = new User ({
        firstName: "Rahul",
        lastName: "Kumar",
        emailId: "rahul@gmail.com",
        password: "rahul@123"
    });

    
    try{
        await user.save();
        res.send("User added successfully!");
    }catch(err){
        res.status(400).send("Error saving the user:" + err.message)
    }
});


connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is listning on port 7777...");
    })
}).catch((err) => {
    console.log("Database cannot connected!");
})