import express, { NextFunction } from 'express';
import Level from '../models/level';

const router = express.Router();

interface LevelParams {
  id: string;
}

// GET /api/level/:id
router.get(
  '/:id',
  (req: express.Request<LevelParams>, res: express.Response, next: NextFunction): void => {
    (async () => {
      const { id } = req.params;

      try {
        const level = await Level.findByPk(id);

        if (!level) {
          return res.status(404).send({ message: 'Level not found' });
        }

        res.json(level);
      } catch (error) {
        console.error('Error fetching level:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    })().catch(next);
  }
);

export default router;
