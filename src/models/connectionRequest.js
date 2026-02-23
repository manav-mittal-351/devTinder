const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },
},
{
    timestamps: true,
});

connectionRequestSchema.index({senderUserId: 1, receiverUserId: 1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    // Check if the senderUserId is same as receiverUserId
    if(connectionRequest.senderUserId.equals(connectionRequest.receiverUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;