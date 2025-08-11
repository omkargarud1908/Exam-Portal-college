// In backend/server.js

const express = require('express');
const userRoutes = require('./routes/userRoutes'); // <-- ADD THIS LINE
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');


const dotenv =require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // <-- IMPORT our new db config

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

// Create the Express app
const app = express();


// --- Middleware ---
app.use(cors());
app.use(express.json());


//Routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes); 
// --- Basic Test Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT,'0.0.0.0',() => console.log(`Server running on port ${PORT} 🔥`));