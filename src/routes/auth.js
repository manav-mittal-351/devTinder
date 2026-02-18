const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {isUserDataValid} = require("../utils/validation");
const bcrypt = require("bcrypt");



// User getting signUp
authRouter.post("/signUp", async (req,res) => {
    
    try{

        // Validation of user data
        isUserDataValid(req);

        const {firstName, lastName, email, password, skills} = req.body;

        // validating is there no duplicate email.
        const isEmailPresent = await User.findOne({email});
        if(isEmailPresent){
            throw new Error("User already present in the database!");
        }

        // Password encryption
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


// User getting login
authRouter.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid email!");
        }

        const isValidPassword = await user.validatePassword(password);

        if(isValidPassword){

            // Adding token to cookie
            // res.cookie("token", "ourbgowebrgodgjwkwbudwonjhruowboidnvwrbw");
            const token = await user.getJWT();
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


module.exports = authRouter;