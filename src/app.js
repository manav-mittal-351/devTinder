const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user");
const {isUserDataValid} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/Auth");


app.use(express.json());
app.use(cookieParser());

// User getting login
app.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid email!");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(isValidPassword){


            // Adding token to cookie
            // res.cookie("token", "ourbgowebrgodgjwkwbudwonjhruowboidnvwrbw");
            const token = await jwt.sign({_id: user._id}, "@DevTinder@123", {
                expiresIn: "1d"
            });
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });

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

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
    const user = req.user;
    res.send(user.firstName + " sent the connection request!");
})

app.get("/profile", userAuth, async (req,res) => {
    const user = req.user;
    res.send(user);
})

// Adding user in database
app.post("/signUp", async (req,res) => {
    
    try{

        // Validation of user data
        isUserDataValid(req);

        const {firstName, lastName, email, password, skills} = req.body;

        // validating is there no duplicate email.
        const isEmailPresent = await User.findOne({email});
        if(isEmailPresent){
            throw new Error("User already present in the database!");
        }

        // Password encryptio
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            skills,
        });

        await user.save();
        res.send("User added successfully!");
    }
    catch(err){
        console.error("User cannot added!");
        res.status(400).send("User cannot added: " + err.message);
    }
});

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

    