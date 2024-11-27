import express, { Request, Response, NextFunction } from 'express';
import { Level, Item, Enemy } from '../models/index';
import { authenticate, authenticateLevelAccess } from './middleware/auth';

const router = express.Router();

// Get all enemies
const getAllEnemies = async (req: Request, res: Response): Promise<void> => {
    try {
        const enemies = await Enemy.findAll(); // Fetch all levels
        res.status(200).json(enemies);
    } catch (error) {
        console.error('Error fetching enemies:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get enemy by type
const getEnemyByType = async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;
    try {
        const enemy = await Enemy.findOne({ where: { type } });
        if (enemy) {
            res.status(200).json(enemy);
        } else {
            res.status(404).json({ error: 'Enemy not found.' });
        }
    } catch (error) {
        console.error('Error fetching enemy by type:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// GET /api/enemy/type/:type
router.get('/type/:type', authenticate, getEnemyByType);

// GET /api/enemy/all
router.get('/all', authenticate, getAllEnemies);

export default router;