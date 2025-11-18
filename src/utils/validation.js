const validator = require("validator");

const isUserDataValid = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail){
        throw new Error("Please enter a valid email!");
    }
    else if(!validator.isStrongPassword){
        throw new Error("Please enter a strong password!");
    }
};

module.exports = {
    isUserDataValid,
};