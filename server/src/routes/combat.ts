import express, { Request, Response } from 'express';
const router = express.Router();

const combatSessions: { [key: string]: { player: any; enemy: any; turn: string } } = {};

// Calculate damage function
const calculateDamage = (character: any): number => {
    if (!character.currentWeapon) {
        console.log("Character has no weapon equipped. Using default damage.");
        return character.attack;
    }

    switch (character.currentWeapon.itemName) {
        case 'Bow':
            return Math.floor(Math.random() * 10) + 1;
        case 'Sword':
            return Math.floor(Math.random() * 6) + 3;
        case 'Laser Gun':
            return Math.floor(Math.random() * 46) + 5;
        default:
            return 1;
    }
};


const playerAttack = async (req: Request, res: Response): Promise<void> => {
    const { combatId } = req.body;

    const combat = combatSessions[combatId];
    if (!combat) {
        res.status(404).json({ error: "Combat session not found." });
        return;
    }

    if (combat.turn !== "player") {
        res.status(400).json({ error: "It's not your turn." });
        return;
    }

    // Calculate damage using the provided calculateDamage function
    const damage = calculateDamage(combat.player);
    combat.enemy.health -= (damage - combat.enemy.defense);

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        delete combatSessions[combatId];
        res.status(200).json({ 
            message: "Victory! You defeated the enemy.", 
            updatedPlayer: combat.player, 
            updatedEnemy: combat.enemy 
        });
        return;
    }

    // Update turn to enemy
    combat.turn = "enemy";

    res.status(200).json({ 
        message: `You dealt ${damage} damage.`,
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy 
    });
};

const playerSpell = async (req: Request, res: Response): Promise<void> => {
    const { combatId } = req.body;

    const combat = combatSessions[combatId];
    if (!combat) {
        res.status(404).json({ error: "Combat session not found." });
        return;
    }

    if (combat.turn !== "player") {
        res.status(400).json({ error: "It's not your turn." });
        return;
    }

    if (combat.player.mana < 10) {
        res.status(400).json({ error: "Not enough mana to cast a spell." });
        return;
    }

    const damage = combat.player.attack * 2;
    combat.enemy.health -= damage;
    combat.player.mana -= 10;

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        delete combatSessions[combatId];
        res.status(200).json({ 
            message: "Victory! You defeated the enemy with a spell.", 
            updatedPlayer: combat.player, 
            updatedEnemy: combat.enemy 
        });
        return;
    }

    res.status(200).json({ 
        message: `You cast a spell and dealt ${damage} damage.`,
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy 
    });

    // Update turn to enemy
    combat.turn = "enemy";
};




export default router;