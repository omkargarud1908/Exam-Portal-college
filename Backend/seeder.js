// In backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users.js');
const User = require('./models/User.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const importData = async () => {
  try {
     
    
    await User.insertMany(users); // This uses our model, so passwords will be hashed
    console.log('✅ Data Imported! Teacher and Student created.');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

importData();