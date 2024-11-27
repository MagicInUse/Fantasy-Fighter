import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
import '../config/database';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Routes
import authRoutes from './auth';
import characterRoutes from './character';
import inventoryRoutes from './inventory';
import combatRoutes from './combat';
import levelRoutes from './level';
import enemyRoutes from './enemy';

app.use('/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/level', levelRoutes);
app.use('/api/enemy', enemyRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../../client/dist')));

// Route testing
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the RPG Backend!');
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});