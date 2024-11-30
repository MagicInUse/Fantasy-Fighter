import express, { Request, Response, NextFunction } from 'express';
import { Level, Item, Enemy, sequelize, Character } from '../models/index';
import { authenticate, authenticateLevelAccess } from './middleware/auth';
import { getPlayerData } from './combat';

const router = express.Router();


// Seed level data
const levelData = [
    {
        level_name: "Forest Ent's Grove",
        loot_table: [
            { itemName: "Hero's Sword", type: 1, quantity: 1, damage: 20, description: "A sturdy wooden shield." },
            { itemName: "Magic Sap", type: 2, quantity: 3, effect: "Restores 20 HP", description: "A magical sap that heals wounds." },
        ],
        description: "A peaceful grove inhabited by a powerful Forest Ent.",
        complete: false,
        locked: false,
        enemy: {
            type: "Forest Ent",
            sprite: '/assets/forestEnt.gif',
            health: 30,
            mana: 50,
            attack: 10,
            defense: 0,
        },
    },
    {
        level_name: "Robot Factory",
        loot_table: [
            { itemName: "Laser Gun", type: 1, quantity: 1, damage: 35, description: "A powerful laser gun." },
            { itemName: "Robot Parts", type: 3, quantity: 5, description: "Parts from a broken robot." },
        ],
        description: "An abandoned factory crawling with malfunctioning robots.",
        complete: false,
        locked: true,
        enemy: {
            type: "Robot",
            sprite: '/assets/redRobot.gif',
            health: 120,
            mana: 30,
            attack: 20,
            defense: 5,
        },
    },
    {
        level_name: "Zombie Outbreak",
        loot_table: [
            { itemName: "Chainsaw", type: 1, quantity: 1, damage: 60, description: "An old chainsaw, it still rumbles as if brand new." },
            { itemName: "Zombie Flesh", type: 3, quantity: 2, description: "Flesh from a zombie." },
        ],
        description: "A dark and desolate town overrun by zombies.",
        complete: false,
        locked: true,
        enemy: {
            type: "Zombie Brute",
            sprite: '/assets/zombie.png',
            health: 360,
            mana: 0,
            attack: 30,
            defense: 10,
        },
    },
    {
        level_name: "Alien Mayhem",
        loot_table: [
            { itemName: "Ray Gun", type: 1, quantity: 1, damage: 85, description: "A ray gun from outer space." },
            { itemName: "Alien Blood", type: 3, quantity: 3, description: "Blood from an alien." },
        ],
        description: "A spaceship filled with hostile aliens.",
        complete: false,
        locked: true,
        enemy: {
            type: "Alien",
            sprite: '/assets/placeHolder.png',
            health: 400,
            mana: 100,
            attack: 35,
            defense: 15,
        },
    },
    {
        level_name: "Ghost Ship",
        loot_table: [
            { itemName: "Phantom Blade", type: 1, quantity: 1, damage: 110, description: "A blade that can cut through ghosts." },
            { itemName: "Ghostly Essence", type: 2, quantity: 1, effect: "Restores 100 HP", description: "An essence from a ghost." },
        ],
        description: "A haunted ship filled with ghostly apparitions.",
        complete: false,
        locked: true,
        enemy: {
            type: "Ghost Captain",
            sprite: '/assets/placeHolder.png',
            health: 450,
            mana: 50,
            attack: 40,
            defense: 20,
        },
    },
    {
        level_name: "Underwater Abyss",
        loot_table: [
            { itemName: "Trident", type: 1, quantity: 1, damage: 140, description: "A trident from the depths of the ocean." },
            { itemName: "Sea Shells", type: 3, quantity: 5, effect: "Increases defense by 15", description: "Shells from the ocean floor." },
        ],
        description: "An underwater abyss filled with dangerous sea creatures.",
        complete: false,
        locked: true,
        enemy: {
            type: "Kraken",
            sprite: '/assets/placeHolder.png',
            health: 500,
            mana: 50,
            attack: 45,
            defense: 25,
        },
    },
    {
        level_name: "Lava Caverns",
        loot_table: [
            { itemName: "Fire Staff", type: 1, quantity: 1, damage: 170, description: "A staff that controls fire." },
            { itemName: "Lava Rock", type: 3, quantity: 3, effect: "Increases attack by 10", description: "A rock from the depths of the earth." },
        ],
        description: "A dangerous cavern filled with molten lava.",
        complete: false,
        locked: true,
        enemy: {
            type: "Ember Lord",
            sprite: '/assets/placeHolder.png',
            health: 550,
            mana: 100,
            attack: 50,
            defense: 30,
        },
    },
    {
        level_name: "Giant's Peak",
        loot_table: [
            { itemName: "Giant's Club", type: 1, quantity: 1, damage: 210, description: "A club used by giants." },
            { itemName: "Giant's Tooth", type: 3, quantity: 2, effect: "Increases health by 50", description: "A tooth from a giant." },
        ],
        description: "A mountain peak inhabited by a powerful Giant.",
        complete: false,
        locked: true,
        enemy: {
            type: "Giant",
            sprite: '/assets/placeHolder.png',
            health: 600,
            mana: 50,
            attack: 55,
            defense: 35,
        },
    },
    {
        level_name: "Ice Fortress",
        loot_table: [
            { itemName: "Ice Bow", type: 1, quantity: 1, damage: 220, description: "A bow that shoots ice arrows." },
            { itemName: "Ice Shards", type: 3, quantity: 5, effect: "Increases mana by 20", description: "Shards of ice from a frozen fortress." },
        ],
        description: "A frozen fortress inhabited by a powerful Ice Queen.",
        complete: false,
        locked: true,
        enemy: {
            type: "Ice Queen",
            sprite: '/assets/placeHolder.png',
            health: 650,
            mana: 200,
            attack: 60,
            defense: 40,
        },
    },
    {
        level_name: "Dragon's Lair",
        loot_table: [
            { itemName: "Dragon Spear", type: 1, quantity: 1, damage: 260, description: "A spear that can pierce dragon scales." },
            { itemName: "Dragon Scale", type: 3, quantity: 3, effect: "Increases defense by 20", description: "A scale from a dragon." },
        ],
        description: "A fiery lair inhabited by a powerful Dragon.",
        complete: false,
        locked: true,
        enemy: {
            type: "Dragon",
            sprite: '/assets/placeHolder.png',
            health: 700,
            mana: 100,
            attack: 65,
            defense: 45,
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
        const levels = await Level.findAll();
        const userId = req.user.id;
        console.log("User ID:", userId);

        const character = await Character.findOne({ where: { userId } });
        console.log("Character:", character);
        if (!character) {
            res.status(404).json({ error: "Character not found." });
            return;
        }

        const userLevel = character.dataValues.level;

        const updatedLevels = await Promise.all(levels.map(async level => {
            level.complete = userLevel > level.level_id;
            level.locked = userLevel < level.level_id;
            await level.save();
            return level.toJSON();
        }));
        res.status(200).json(updatedLevels);
    } catch (error) {
        console.error("Error fetching levels:", error);
        res.status(500).json({ error: "Internal server error." });
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
router.get('/all', authenticate, getAllLevels);

// POST /api/level/seed
// or POST /api/level/seed?force=true to force reseed
// router.post('/seed',  createLevels);

// GET /api/level/:id
router.get('/:id', getLevelById);

// GET /api/level/:id/details
// Get level by id with associated loot and enemy
router.get('/:id/details', getLevelWithDetails);

export default router;
