import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// User Registration
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({ username, email, password: hashedPassword,});

    res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});