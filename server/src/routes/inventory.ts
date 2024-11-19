import express, { Request, Response } from 'express';
const router = express.Router();

// Test inventory data
const inventory = [
    { id: 1, itemName: 'Bow', type: 'Weapon', damage: (() => Math.floor(Math.random() * 10) + 1) },
    { id: 2, itemName: 'Sword', type: 'Weapon', damage: (() => Math.floor(Math.random() * 6) + 3) }
];

// GET /api/inventory 
// Gets all inventory items
router.get('/', (req, res) => {
    res.json(inventory);
});

// POST /api/inventory 
// Add item to inventory
router.post('/', (req: Request, res: Response) => {
    const newItem = req.body;
    inventory.push(newItem);
    res.status(201).json(newItem);
});

module.exports = router;