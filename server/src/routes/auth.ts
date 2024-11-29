import express, { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Item, Character } from '../models/index';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// User Registration
router.post('/create', (req, res, next): void => {
  (async () => {
    const { username, password } = req.body;

    try {
      // Check if username is already in use
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = await User.create({
        username,
        password: hashedPassword,
        level: 1,
      });

      // Create default Character for the new user
      const newCharacter = await Character.create({
        userId: newUser.id,
        characterName: "Hero",
        level: 1,
        health: 100,
        mana: 50,
        currentWeapon: "Sword",
        attack: 3,
        defense: 1,
        username: newUser.username,
        sprite: "../assets/heroBlue.gif",
      });

      // Optionally add default items to the character
      const [sword, created] = await Item.findOrCreate({
        where: { itemName: "Sword" },
        defaults: {
          itemName: "Sword",
          description: "A sharp blade used for combat.",
          type: 1, // Weapon
          quantity: 1,
          damage: Math.floor(Math.random() * (10 - 6 + 1)) + 6, // Random damage 6-10
        },
      });

      await newCharacter.addItem(sword);
      newCharacter.currentWeapon = sword.itemName;
      await newCharacter.save();

      res.status(201).json({
        message: 'User and character created successfully.',
        user: { id: newUser.id, username: newUser.username },
        character: newCharacter,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  })().catch(next);
});

// User Login
router.post('/login', (req, res, next): void => {
  (async () => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '8h' }
      );

      res.json({ message: 'Login successful.', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  })().catch(next);
});

export default router;
