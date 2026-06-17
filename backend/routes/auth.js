const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // The blueprint we just made

// 📝 SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // 2. Scramble (Hash) the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save the new user to MongoDB
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Saving the scrambled version!
        });
        await newUser.save();

        // 4. Create the JWT "Wristband"
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// 🔐 LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. Compare the typed password with the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Create the JWT "Wristband"
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;