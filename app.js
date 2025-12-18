const express = require('express');
const app = express();

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Connect to the database
const connectToDB = require('./config/db');
connectToDB();

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON bodies

// Import user routes
const userRoutes = require('./routes/user.routes');
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Task Tracker API is running');
});

app.listen(3000, () => {
    console.log('Task Tracker app is running on http://localhost:3000');
});