//controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body;

        // 🚨 SECURITY: Never trust frontend role
        const allowedRoles = ['donor', 'seeker'];
        const safeRole = allowedRoles.includes(role) ? role : 'donor';

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role: safeRole
        });

        res.status(201).json({
            message: 'Account created successfully',
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(400).json({ message: 'Invalid credentials' });
}


        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 🔥 UPDATE THIS RESPONSE
        res.json({
            token,
            role: user.role,
            user: {
                id: user._id,
                fullName: user.fullName
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
