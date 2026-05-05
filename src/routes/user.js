const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about akills";

// Get all the user pending connection request for the loggedIn user.
userRouter.get("/user/requests/received", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            receiverUserId: loggedInUser._id,
            status: "interested"
        }).populate("senderUserId", USER_SAFE_DATA);
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

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try{

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {receiverUserId: loggedInUser._id, status: "accepted"},
                {senderUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("senderUserId", USER_SAFE_DATA).populate("receiverUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.senderUserId._id.toString() === loggedInUser._id.toString()){
                return row.receiverUserId;
            }
            return row.senderUserId;
        });
        
        res.json({ data })
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})

userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        // User should see all the user cards except his own card.
        // User should not see the cards of his connections.
        // User should not see the cards of ignored cards.
        // User should not see the cards of already sent the connection request.
        
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit; 

        // Find all connection request ( sent + received )
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { senderUserId: loggedInUser._id }, { receiverUserId: loggedInUser._id }
            ],
        });

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.senderUserId.toString());
            hideUsersFromFeed.add(req.receiverUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
          .select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);
         
          res.json({ data: users });
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
})

module.exports = userRouter;
