import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
import '../config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
import authRoutes from './auth';
import characterRoutes from './character';
import inventoryRoutes from './inventory';
import combatRoutes from './combat';
import levelRoutes from './level';

app.use('/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/level', levelRoutes);

// Route testing
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the RPG Backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});