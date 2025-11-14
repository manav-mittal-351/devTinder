const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user");


app.use(express.json());

// Adding user in database
app.post("/signUp", async (req,res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully!");
    }
    catch(err){
        console.error("User cannot added!");
        res.status(400).send("User cannot added: " + err.message);
    }
});

// Get user by emailId
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;
    try{
        const users = await User.findOne({emailId: userEmail});
        if(userEmail.length === 0){
            res.status(404).send("User not found!");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(500).send("Something went wrong!");
    }
})

// Getting all users
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(500).send("Something went wrong!");
    }
})

// Delete users by there userId
app.delete("/user/:userId", async (req,res) => {
    const userId = req.params.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully!");
    }
    catch(err){
        res.status(400).send("Something went wrong!");
    }
});


// Update user by there userId
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params.userId;
    const data = req.body;
    try{

        const UPDATE_ALLOWED = ["firstName", "lastName", "age", "gender", "country", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => 
            UPDATE_ALLOWED.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("Update not allowed!");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10!");
        }


        await User.findByIdAndUpdate(userId, data, {returnDocument: "after", runValidators: true});
        res.send("Data updated successfully!");
    }
    catch(err){
        res.status(400).send("UPDATE FAILED: " + err.message);
    }
})

connectDB().then(() => {
    try{
        console.log("Database connected succsefully...");
        app.listen(3000, () => {
            console.log("Server listening on port 3000...");
        })
    }
    catch(err){
        console.error("Database cannot connected!");
    }
})

    