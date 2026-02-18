const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        validate(value){
            const regex = /^[A-Za-z\s\-']+$/;
            if(!regex.test(value)){
                throw new Error("First name can only contain letters, spaces, hyphens, and apostrophes");
            }
        }
    },
    lastName: {
        type: String,
        validate(value){
            const regex = /^[A-Za-z\s\-']+$/;
            if(!regex.test(value)){
                throw new Error("Last name can only contain letters, spaces, hyphens, and apostrophes");
            }
        }
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter the valid email address!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
        if(!validator.isStrongPassword(value)){
            throw new Error("Please enter the strong password! " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
    },
    about: {
        type: String,
        default: "This is the default about of user!",
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "@DevTinder@123");

    return token;
}


userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}
// userSchema.index({ email: 1 }, { unique: true });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;