import express, { Request, Response } from 'express';
import { Item, Character } from '../models/index';
import { authenticate } from './middleware/auth';

const router = express.Router();

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

// Function to update character's currentWeapon
export const updateCurrentWeapon = async (req: Request, res: Response): Promise<void> => {
    const { itemName } = req.body;

    if (!itemName) {
        res.status(400).json({ message: 'itemName is required' });
        return;
    }

    try {
        const character = await Character.findOne({ where: { id: req.user.id } });
        if (!character) {
            res.status(404).json({ message: 'Character not found' });
            return;
        }

        character.currentWeapon = itemName;
        await character.save();

        res.json({ message: 'Current weapon updated successfully', currentWeapon: character.currentWeapon });
    } catch (error) {
        console.error('Error updating current weapon:', error);
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

// Add the new POST route
router.post('/equip', authenticate, updateCurrentWeapon);

export default router;