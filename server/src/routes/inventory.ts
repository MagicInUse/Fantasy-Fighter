import express, { Request, Response } from 'express';
import { Item, Character } from '../models/index';
import { authenticate } from './middleware/auth';

const router = express.Router();

const itemData = [
    { id: 1, itemName: 'Bow', description: 'A ranged weapon that fires iron-tipped arrows', type: 1, quantity: 1, damage: Math.floor(Math.random() * 10) + 1 },
    { id: 2, itemName: 'Sword', description: 'A sharp blade used for combat.', type: 1, quantity: 1, damage: Math.floor(Math.random() * 6) + 3 },
    { id: 3, itemName: 'Health Potion', description: 'A swirling green liquid.', type: 2, quantity: 3, effect: 'Heals 10 health' },
    { id: 4, itemName: 'Mana Potion', description: 'A thick blue substance.', type: 3, quantity: 1, effect: 'Restores 10 mana' },
];

// Item seed data
export const createItems = async (req: Request, res: Response): Promise<void> => {

    try {
        const existingItemsCount = await Item.count();
        if (existingItemsCount > 0) {
            console.log('Items have already been seeded.');
            return;
        }

        await Item.bulkCreate(itemData);
        console.log('Items created successfully.');
    } catch (error) {
        console.error('Error seeding item:', error);
        console.log('Internal server error.');
    }
};

const getCharacterInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const character = await Character.findOne({ where: { id: req.user.id } });
        if (!character) {
            res.status(404).json({ message: 'Character not found' });
            return;
        }
        const inventory = await character.getItems();
        res.json(inventory);
    } catch (error) {
        console.error('Error fetching character inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

router.get('/inventory/:playerId', getCharacterInventory);

// GET /api/inventory 
// Gets all inventory items
router.get('/', authenticate, getCharacterInventory);

// POST /api/inventory 
// Add item to inventory
router.post('/seed', createItems);

export default router;