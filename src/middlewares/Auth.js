const express = require("express");
const app = express();

const adminAuth = (req,res,next) => {
    console.log("Admin auth is getting checked!");
    const token = "abc123";
    const isAdminAuthorized = token === "abc";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request!");
    }
    else{
        next();
    }
}

const userAuth = (req,res,next) => {
    console.log("User auth is getting checked!");
    const token = "123454";
    const isUserAuthorized = token === "123";
    if(!isUserAuthorized){
        res.status(401).send("Unauthorized request!");
    }
    else{
        next();
    }
}


module.exports = {
    adminAuth, userAuth
};