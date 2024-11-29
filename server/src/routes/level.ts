import express, { Request, Response, NextFunction } from 'express';
import { Level, Item, Enemy, sequelize, Character } from '../models/index';
import { authenticate, authenticateLevelAccess } from './middleware/auth';

const router = express.Router();


// Seed level data
const levelData = [
    {
        level_name: "Forest Ent's Grove",
        loot_table: [
            { itemName: "Hero's Sword", type: 3, quantity: 1, effect: "Increases defense by 5", description: "A sturdy wooden shield." },
            { itemName: "Magic Sap", type: 2, quantity: 3, effect: "Restores 20 HP", description: "A magical sap that heals wounds." },
        ],
        description: "A peaceful grove inhabited by a powerful Forest Ent.",
        complete: false,
        locked: false,
        enemy: {
            type: "Forest Ent",
            sprite: '/assets/forestEnt.gif',
            health: 20,
            mana: 50,
            attack: 5,
            defense: 0,
        },
    },
    {
        level_name: "Robot Factory",
        loot_table: [
            { itemName: "Laser Gun", type: 1, quantity: 1, damage: 25, description: "A powerful laser gun." },
            { itemName: "Robot Parts", type: 3, quantity: 5, description: "Parts from a broken robot." },
        ],
        description: "An abandoned factory crawling with malfunctioning robots.",
        complete: false,
        locked: true,
        enemy: {
            type: "Robot",
            sprite: '/assets/redRobot.gif',
            health: 100,
            mana: 30,
            attack: 25,
            defense: 10,
        },
    },
    {
        level_name: "Zombie Outbreak",
        loot_table: [
            { itemName: "Chainsaw", type: 1, quantity: 1, damage: 50, description: "An old chainsaw, it still rumbles as if brand new." },
            { itemName: "Zombie Flesh", type: 3, quantity: 2, description: "Flesh from a zombie." },
        ],
        description: "A dark and desolate town overrun by zombies.",
        complete: false,
        locked: true,
        enemy: {
            type: "Zombie Brute",
            sprite: '/assets/zombie.png',
            health: 350,
            mana: 0,
            attack: 20,
            defense: 5,
        },
    },
];


export const createLevels = async (force = true, res: Response): Promise<void> => {
    // TODO: Remove force query param in production
    try {
        if (force === true) {
            await sequelize.query(`DO $$ BEGIN
                EXECUTE (SELECT string_agg('DROP TABLE IF EXISTS ' || tablename || ' CASCADE;', ' '))
                FROM pg_tables
                WHERE schemaname = 'public';
            END $$;`);
            
            await sequelize.query(`DO $$ BEGIN
                EXECUTE COALESCE(
                    (
                        SELECT string_agg('ALTER SEQUENCE ' || sequencename || ' RESTART WITH 1;', ' ')
                        FROM pg_sequences 
                        WHERE sequencename LIKE '%_seq'
                    ),
                    ''
                );
            END $$;`);
            
            console.log("All tables dropped and sequences reset.");
            
            // Re-sync models to recreate tables
            await sequelize.sync();
            console.log("Models synced after dropping tables.");
        }
        

        // Check if levels already exist
        const existingLevelsCount = await Level.count();
        if (existingLevelsCount > 0) {
            console.log("Levels have already been seeded.");
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
                const createdItems = await Item.bulkCreate(loot, { validate: true });

                // Update the Level's loot_table field
                await newLevel.update({
                    loot_table: createdItems.map(item => ({
                        itemName: item.itemName,
                        type: item.type,
                        quantity: item.quantity,
                        damage: item.damage,
                        effect: item.effect,
                        description: item.description,
                    })),
                });
            }

            // Create and associate enemy
            if (level.enemy) {
                await Enemy.create({
                    ...level.enemy,
                    level_id: newLevel.level_id,
                    sprite: level.enemy.sprite,
                    name: level.enemy.type,
                    health: level.enemy.health,
                    mana: level.enemy.mana,
                    attack: level.enemy.attack,
                    defense: level.enemy.defense, // Added defense attribute
                });
            }
        }

        console.log("Levels and loot seeded successfully.");
    } catch (error) {
        console.error("Error creating levels:", error);
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
// TODO: Add get enemy for level by id

// GET /api/level/all
router.get('/all', getAllLevels);

// POST /api/level/seed
// or POST /api/level/seed?force=true to force reseed
// router.post('/seed',  createLevels);

// GET /api/level/:id
router.get('/:id', getLevelById);

// GET /api/level/:id/details
// Get level by id with associated loot and enemy
router.get('/:id/details', getLevelWithDetails);

export default router;
