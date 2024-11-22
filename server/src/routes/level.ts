import express, { Request, Response, NextFunction } from 'express';
import { Level } from '../models/index';
import { authenticate, authenticateLevelAccess } from './middleware/auth';

const router = express.Router();

const getLevelById = async ( req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const level = await Level.findByPk(id);

    if (!level) {
      res.status(404).send({ message: 'Level not found' });
      return;
    }

    res.json(level);
  } catch (error) {
    console.error('Error fetching level:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// GET /api/level/:id
router.get('/:id', authenticateLevelAccess, getLevelById);

export default router;
