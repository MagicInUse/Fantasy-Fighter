import express, { Request, Response } from 'express';
const router = express.Router();

// Test player data
// TODO: replace with Sequelize model, allow for User login and player creation/fetching.
const characterStats = {
    id: 1,
    characterName: 'Hero',
    level: 1,
    health: 100,
    mana: 50,
    currentWeapon: 'Sword',
}

// GET /api/character
// Get character stats
router.get('/', (req: Request, res: Response) => {
    res.json(characterStats);
});

export default router;