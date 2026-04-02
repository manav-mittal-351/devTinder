const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionRequest");

// Get all the user pending connection request for the loggedIn user.
userRouter.get("/user/requests/received", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            receiverUserId: loggedInUser._id,
            status: "interested"
        }).populate("senderUserId", "firstName lastName");
        // }).populate("senderUserId", ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;