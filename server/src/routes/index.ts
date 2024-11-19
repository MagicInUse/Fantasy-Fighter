import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
const playerRoutes = require('./player');
const inventoryRoutes = require('./inventory');
const combatRoutes = require('./combat');

app.use('/api/player', playerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/combat', combatRoutes);

// Route testing
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the RPG Backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});