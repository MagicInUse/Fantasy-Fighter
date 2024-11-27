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

// Player attacks with weapon
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
    combat.enemy.health -= (combat.enemy.defense - damage);

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

    res.status(200).json({ 
        message: `You dealt ${damage} damage.`,
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy 
    });

    // Update turn to enemy
    combat.turn = "enemy";

    // Execute enemy turn
    const enemyResult = enemyTurn(combat);

    // If the player is defeated during the enemy's turn
    if (combat.player.health <= 0) {
        delete combatSessions[combatId];
        res.status(200).json(enemyResult);
        return;
    }

    // Set turn back to player
    combat.turn = "player";

    res.status(200).json({
        message: `Enemy dealt ${damage} damage. ${enemyResult.message}`,
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy,
    });
};

// Players casts spell
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

        // Execute enemy turn
    const enemyResult = enemyTurn(combat);

    // If the player is defeated during the enemy's turn
    if (combat.player.health <= 0) {
        delete combatSessions[combatId];
        res.status(200).json(enemyResult);
        return;
    }

    // Set turn back to player
    combat.turn = "player";

    res.status(200).json({
        message: `Enemy dealt ${damage} damage. ${enemyResult.message}`,
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy,
    });
};

// Enemy attacks player
const enemyTurn = (combat: any): { message: string; updatedPlayer: any; updatedEnemy: any } => {
    // Determine enemy action (70% attack, 30% defend)
    const action = Math.random() < 0.7 ? "attack" : "defend";

    if (action === "attack") {
        const damage = calculateDamage(combat.enemy);
        combat.player.health -= (combat.player.defense - damage);

        // Check if the player is defeated
        if (combat.player.health <= 0) {
            return { 
                message: `Enemy attacked for ${damage} damage and defeated you!`, 
                updatedPlayer: combat.player, 
                updatedEnemy: combat.enemy 
            };
        }

        return { 
            message: `Enemy attacked for ${damage} damage.`,
            updatedPlayer: combat.player,
            updatedEnemy: combat.enemy 
        };
    } else {
        combat.enemy.defense += 5; // Temporary defense boost
        return { 
            message: "Enemy defended, increasing defense by 5.",
            updatedPlayer: combat.player,
            updatedEnemy: combat.enemy 
        };
    }
};







export default router;