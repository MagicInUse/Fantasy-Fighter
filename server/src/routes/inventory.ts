import express, { Request, Response } from 'express';
import { Item } from '../models/index';
const router = express.Router();

// Item seed data
export const createItems = async (req: Request, res: Response): Promise<void> => {
    const itemData = [
        { id: 1, itemName: 'Bow', type: 1, quantity: 1, damage: Math.floor(Math.random() * 10) + 1 },
        { id: 2, itemName: 'Sword', type: 2, quantity: 1, damage: Math.floor(Math.random() * 6) + 3 }
    ];

    try {
        const existingItemsCount = await Item.count();
        if (existingItemsCount > 0) {
            console.log('Items have already been seeded.');
            return;
        }

        await Item.bulkCreate(itemData);
        res.status(201).json({ message: 'Items created successfully.' });
    } catch (error) {
        console.error('Error seeding item:', error);
        res.status(500).json({ error: 'Internal server error.' });
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