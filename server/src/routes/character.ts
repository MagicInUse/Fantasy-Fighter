import express, { Request, Response } from 'express';
import { Character, Item } from '../models/index';
import { authenticate } from './middleware/auth';

const router = express.Router();

// Create default weapon
// (async () => {
// const existingSword = await Item.findOne({ where: { itemName: "Sword" } });
// if (!existingSword) {
//     await Item.create({
//         itemName: "Sword",
//         type: 1,
//         quantity: 1,
//         damage: 5,
//     });
// }
// })();


// Create default Character
const createCharacter = async (req: Request, res: Response): Promise<void> => {
    // const sword = await Item.create({
    //     itemName: "Sword",
    //     type: 1,
    //     quantity: 1,
    //     damage: 5,
    // });
    // const { id: userId } = req.body.user;
    const userId = 1;

    try {
        const newCharacter = await Character.create({
            userId,
            characterName: "Hero",
            level: 1,
            health: 100,
            mana: 50,
            currentWeapon: "Sword",
        });

        // await newCharacter.addItem(sword);

        res.status(201).json({
            message: 'Character created successfully.',
            character: newCharacter,
        });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get users characters and stats
const userCharacters = async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.body.user;

    try {
        const characters = await Character.findAll({ where: { userId } });

    if (characters.length === 0) {
        res.status(404).json({ error: 'No characters found for this user.' });
        return;
    }
    res.status(200).json(characters);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }

};

const getCharacterInventory = async (req: Request, res: Response): Promise<void> => {
    // const { id: userId } = req.body.user;
    // const { characterId } = req.params;

    const userId = 1;
    const characterId = 1;

    try {
        const character = await Character.findOne({ where: { id: characterId, userId }, include: {model:Item, as: "items"} });
        
        if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
        }  
        res.status(200).json({ items: character.items });
    } catch (error) {
        console.error('Error fetching character inventory:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
    
};



// POST /api/character
// Create character
router.post('/', authenticate, createCharacter);

// GET /api/character
// Get character stats
router.get('/',  authenticate, userCharacters);

// GET /api/character/inventory/:characterId
router.get('/inventory/:characterId', authenticate, getCharacterInventory);

export default router;