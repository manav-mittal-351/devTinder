const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user");
const {isUserDataValid} = require("./utils/validation");
const bcrypt = require("bcrypt");


app.use(express.json());


// User get login
app.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid cridentials!");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            res.send("Login successfull!");
        }
        else{
            throw new Error("Invalid password!");
        }
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})


// Adding user in database
app.post("/signUp", async (req,res) => {
    
    try{

        // Validation of user data
        isUserDataValid(req);

        const {firstName, lastName, email, password} = req.body;

        // Password encryptio
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

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

    