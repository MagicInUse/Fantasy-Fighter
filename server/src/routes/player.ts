import express, { Request, Response } from 'express';
const router = express.Router();

// Test player data
// TODO: replace with Sequelize model, allow for User login and player creation/fetching.
const playerStats = {
    id: 1,
    name: 'Hero',
    level: 1,
    health: 100,
    mana: 50,
    currentWeapon: 'Sword',
}

// GET /api/player
// Get player stats
router.get('/', (req: Request, res: Response) => {
    res.json(playerStats);
});

module.exports = router;