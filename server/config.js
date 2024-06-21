const mongoose = require("mongoose");
const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
};
module.exports = connect;
