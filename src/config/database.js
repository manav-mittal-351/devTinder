const mongoose = require("mongoose");
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://manavmittal451:TNDpSmehHYgc7D5e@learningmongo.5pdrg9o.mongodb.net/devTinder"
    )
};

module.exports = {
    connectDB
}



