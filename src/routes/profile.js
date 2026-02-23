const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request!");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));    

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, you profile updated successfuly!`,
            data: loggedInUser,
        });
        // res.send(loggedInUser.firstName + ", your profile updated successfuly!");
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})


profileRouter.post("/profile/password", userAuth, async (req,res) => {
    try {

        const user = req.user;
        const { password, newPassword } = req.body;

        if(!password || !newPassword){
            throw new Error("Please provide the current and new password!");
        }

        const checkCurrentPassword = await bcrypt.compare(password, user.password);

        if(!checkCurrentPassword){
            throw new Error("Invalid current password!");
        }

        const newPasswwordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswwordHash
        await user.save();

        res.send("Password changed successfuly!");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})


module.exports = profileRouter;