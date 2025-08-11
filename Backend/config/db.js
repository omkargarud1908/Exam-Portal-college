// In backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use process.env to get the variable from our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected... ✅');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB; // Export the function