const express = require('express');
const router = express.Router();

// Import express-validator for input validation
const {body, validationResult} = require('express-validator');

const bcrypt = require('bcrypt');

// Import the User model
const userModel = require('../models/user.model');

// Import jsonwebtoken for token generation (if needed in future)
const jwt = require('jsonwebtoken');

// Render registration and login pages
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/login', (req, res) => {
    res.render('login');
});


// Handle registration and login form submissions
router.post('/register', 
    body('username').notEmpty().withMessage('Username is required').trim().isLength({min: 3}).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('register', {errors: errors.array()});
        }
        const{ username, email, password } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user to the database
        const newuser = await userModel.create({
            username,
            email,
            password: hashedPassword
        })
    // Registration logic here
    console.log(req.body);

    res.send('User registered successfully');
});


router.post('/login', 
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', {errors: errors.array()});
        }

        // Extract email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const user  = await userModel.findOne({ email }); //
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid email or password'}]});
        }
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid email or password'}]});
        }

        // Generate a JWT token
        const token = jwt.sign({ 
            id: user._id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, 
        { expiresIn: '1h' });

        // Set the token as a cookie
        res.cookie('token', token);

    // Login logic here
    res.send('User logged in successfully');
});




module.exports = router;