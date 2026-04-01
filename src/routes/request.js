const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:receiverUserId", userAuth, async (req,res) => {
    try{
        const senderUserId = req.user._id;
        const receiverUserId = req.params.receiverUserId;
        const status = req.params.status;

        const allowedStatusType = ["interested", "ignore"];

        if(!allowedStatusType.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status});
        }

        const receiverUser = await User.findById(receiverUserId);
        if(!receiverUser){
            return res.status(404).json({message: "User not found!"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { senderUserId, receiverUserId },
                { senderUserId: receiverUserId, receiverUserId: senderUserId },
            ],
        });

        if(existingConnectionRequest){
            return res
            .status(400)
            .send({message: "Connection Request Already Exist!"});
        }
        
        const connectionRequest = new ConnectionRequest({
            senderUserId,
            receiverUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + receiverUser.firstName,
            data,
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try{
        const logedInUser = req.user;
        const {status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            receiverUserId: logedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            return res
            .status(400)
            .json({
                message: "Connection request not found!"
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data })

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;