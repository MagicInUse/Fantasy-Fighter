import e from 'express';
import express, { Request, Response } from 'express';
const router = express.Router();

// POST /api/combat
// Test combat data
router.post('/', (req: Request, res: Response) => {
    const { playerId, levelId } = req.body;

    // Mock combat results
    const combatResult = {
        winner: playerId,
        playerHealth: 50,
        enemyHealth: 0,
        loot: { id: 3, itemName: 'Potion', type: 'Consumable', effect: '+25 Health' }
    };

    res.json(combatResult);
});

module.exports = router;