import express, { Request, Response, NextFunction } from 'express';
import { Level, Item, Enemy } from '../models/index';
import { authenticate, authenticateLevelAccess } from './middleware/auth';

const router = express.Router();


// Seed level data
const levelData = [
  {
      level_name: "Forest Ent's Grove",
      loot_table: [
          { itemName: "Wooden Shield", type: 3, quantity: 1, effect: "Increases defense by 5" },
          { itemName: "Magic Sap", type: 2, quantity: 3, effect: "Restores 20 HP" },
      ],
      description: "A peaceful grove inhabited by a powerful Forest Ent.",
      complete: false,
      locked: false,
      enemy: {
          type: "Forest Ent",
          health: 200,
          damage: 15,
      },
  },
  {
      level_name: "Robot Factory",
      loot_table: [
          { itemName: "Laser Gun", type: 1, quantity: 1, damage: 50 },
          { itemName: "Robot Parts", type: 3, quantity: 5 },
      ],
      description: "An abandoned factory crawling with malfunctioning robots.",
      complete: false,
      locked: true,
      enemy: {
          type: "Robot",
          health: 150,
          damage: 25,
      },
  },
  {
      level_name: "Zombie Outbreak",
      loot_table: [
          { itemName: "Rusty Axe", type: 1, quantity: 1, damage: 25 },
          { itemName: "Zombie Flesh", type: 3, quantity: 2 },
      ],
      description: "A dark and desolate town overrun by zombies.",
      complete: false,
      locked: true,
      enemy: {
          type: "Zombie",
          health: 100,
          damage: 10,
      },
  },
];


const createLevels = async (req: Request, res: Response): Promise<void> => {
  // TODO: Remove force query param in production
  const force = req.query.force === 'true';

  try {
      if (force) {
          await Level.destroy({ where: {} });
          console.log("Levels table cleared. Safe to reseed.");
      }

      // Check if levels already exist
      const existingLevelsCount = await Level.count();
      if (existingLevelsCount > 0) {
          res.status(400).json({ error: "Levels have already been seeded." });
          return;
      }

      // Iterate through level data to create levels and associated loot
      for (const level of levelData) {
          // Create the level
          const newLevel = await Level.create({
              level_name: level.level_name,
              description: level.description,
              complete: level.complete,
              locked: level.locked,
          });

          // Create and associate loot items
          if (level.loot_table && level.loot_table.length > 0) {
              const loot = level.loot_table.map((item) => ({
                  ...item,
                  level_id: newLevel.level_id,
              }));
              await Item.bulkCreate(loot, { validate: true });
          }

          // Create and associate enemy
          if (level.enemy) {
              await Enemy.create({
                  ...level.enemy,
                  level_id: newLevel.level_id,
              })
          }
      }

      res.status(201).json({ message: "Levels and loot seeded successfully." });
  } catch (error) {
      console.error("Error creating levels:", error);
      res.status(500).json({ error: "Internal server error." });
  }
};

// Get single level by id
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

// Get all levels
const getAllLevels = async (req: Request, res: Response): Promise<void> => {
  try {
      const levels = await Level.findAll(); // Fetch all levels
      res.status(200).json(levels);
  } catch (error) {
      console.error('Error fetching levels:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get by id & include loot and enemy
const getLevelWithDetails = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
      const level = await Level.findByPk(id, {
          include: [
              { model: Item, as: 'loot' },
              { model: Enemy, as: 'enemyDetails' },
          ],
      });

      if (!level) {
          res.status(404).json({ error: 'Level not found.' });
          return;
      }

      res.status(200).json(level);
  } catch (error) {
      console.error('Error fetching level with details:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
};


// Endpoints
// TODO: Add authentication middleware to all paths in prod except seed

// POST /api/level/seed
// or POST /api/level/seed?force=true to force reseed
router.post('/seed',  createLevels);

// GET /api/level/:id
router.get('/:id', getLevelById);

// GET /api/level/:id/details
// Get level by id with associated loot and enemy
router.get('/:id/details', getLevelWithDetails);

// GET /api/level/all
router.get('/all', getAllLevels);

export default router;
