import express, { Request, Response } from 'express';
import { Item } from '../models/index';
const router = express.Router();

// Item seed data
export const createItems = async (req: Request, res: Response): Promise<void> => {
    const itemData = [
        { id: 1, itemName: 'Bow', description: 'A ranged weapon that fires iron-tipped arrows', type: 1, quantity: 1, damage: Math.floor(Math.random() * 10) + 1 },
        { id: 2, itemName: 'Sword', description: 'A sharp blade used for combat.', type: 2, quantity: 1, damage: Math.floor(Math.random() * 6) + 3 }
    ];

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

// GET /api/inventory 
// Gets all inventory items
// router.get('/', (req, res) => {
//     res.json(itemData);
// });

// POST /api/inventory 
// Add item to inventory
router.post('/seed', createItems);

export default router;