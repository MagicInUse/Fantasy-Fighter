import express, { Request, Response } from 'express';
import { Character, Enemy } from '../models/index';
import { authenticate } from './middleware/auth';

const router = express.Router();

const combatSessions: { [key: string]: { player: any; enemy: any; turn: string } } = {};

// Fetch player data for combat
const getPlayerData = async (userId: number): Promise<any> => {
    try {
        const character = await Character.findOne({ where: { userId } });

        if (!character) {
            throw new Error("Character not found.");
        }

        return character;
    } catch (error) {
        console.error("Error fetching player character:", error);
        throw error;
    }
};

// Fetch enemy data for combat
const getEnemyData = async (levelId: number): Promise<any> => {
    try {
        const enemy = await Enemy.findOne({ where: { level_id: levelId } });

        if (!enemy) {
            throw new Error("Enemy not found.");
        }

        return enemy;
    } catch (error) {
        console.error("Error fetching enemy data:", error);
        throw error;
    }
};

// Start combat session
const initializeCombat = async (req: Request, res: Response): Promise<void> => {
    const { level_id } = req.body;

    if (!level_id) { // Add validation for levelId
        res.status(400).json({ error: "level_id is required." });
        return;
    }

    const userId = req.user.id;

    try {
        const player = await getPlayerData(userId);
        const enemy = await getEnemyData(level_id);

        const combatId = `combat-${userId}-${level_id}`;
        combatSessions[combatId] = {
            player: player.toJSON(),
            enemy: enemy.toJSON(),
            turn: "player",
        };

        res.status(200).json({ message: "Combat session started.", combatId, player, enemy });
    } catch (error) {
        console.error("Error initializing combat session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


// Calculate damage function
const calculateDamage = (character: any): number => {
    if (!character.currentWeapon) {
        console.log("Character has no weapon equipped. Throwing a punch.");
        return character.attack;
    }

    switch (character.currentWeapon) {
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


// Enemy attacks player
const enemyTurn = (combat: any): { message: string; updatedPlayer: any; updatedEnemy: any } => {
    // Determine enemy action (70% attack, 30% defend)
    const action = Math.random() < 0.7 ? "attack" : "defend";
    
    if (combat.enemy.defense >= 5) {
        combat.enemy.defense -= 5; // Reset defense boost
    }

    if (action === "attack") {
        const damage = combat.enemy.attack;
        combat.player.health -= Math.max(damage - combat.player.defense, 0);

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

    // Calculate player damage
    const damage = calculateDamage(combat.player);
    const actualDamage = Math.max(damage - combat.enemy.defense, 0);
    combat.enemy.health -= actualDamage;

    let messages = [`You attacked for ${damage} damage.`];

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        delete combatSessions[combatId];
        messages.push("Victory! You defeated the enemy.");
        res.status(200).json({ message: messages.join(' '), updatedPlayer: combat.player, updatedEnemy: combat.enemy });
        return;
    }

    // Update turn to enemy
    combat.turn = "enemy";

    // Execute enemy turn
    const enemyResult = enemyTurn(combat);
    messages.push(enemyResult.message);

    // If the player is defeated during the enemy's turn
    if (combat.player.health <= 0) {
        delete combatSessions[combatId];
        messages.push("You have been defeated.");
    } else {
        combat.turn = "player";
    }

    res.status(200).json({
        message: messages.join(' '),
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
    const actualDamage = Math.max(damage - combat.enemy.defense, 0);
    combat.enemy.health -= actualDamage;
    combat.player.mana -= 10;

    let messages = [`You cast a spell and dealt ${damage} damage.`];

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        delete combatSessions[combatId];
        messages.push("Victory! You defeated the enemy.");
        res.status(200).json({ message: messages.join(' '), updatedPlayer: combat.player, updatedEnemy: combat.enemy });
        return;
    }

    // Update turn to enemy
    combat.turn = "enemy";

        // Execute enemy turn
    const enemyResult = enemyTurn(combat);
    messages.push(enemyResult.message);

    if (combat.player.health <= 0) {
        delete combatSessions[combatId];
        messages.push("You have been defeated.");
    } else {
        combat.turn = "player";
    }

    res.status(200).json({
        message: messages.join(' '),
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy,
    });
};

// Player defends
const playerDefend = async (req: Request, res: Response): Promise<void> => {
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


    // Increase player's defense
    combat.player.defense += 5;

    let messages = [`You defended, increasing your defense to ${combat.player.defense}.`];

    // Update turn to enemy
    combat.turn = "enemy";

    // Execute enemy turn
    const enemyResult = enemyTurn(combat);
    messages.push(enemyResult.message);

    // If the player is defeated during the enemy's turn
    if (combat.player.health <= 0) {
        delete combatSessions[combatId];
        messages.push("You have been defeated.");
    } else {
        combat.turn = "player";
    }

    combat.player.defense -= 5; // Reset defense boost
        
    // Set turn back to player
    combat.turn = "player";
    
    res.status(200).json({
        message: messages.join(' '),
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy,
    });
};





// Routes

// POST /api/combat/start
// Start a new combat session
router.post('/start', authenticate, initializeCombat);

// POST /api/combat/attack
// Player attacks enemy
router.post('/attack', authenticate, playerAttack);

// POST /api/combat/spell
// Player casts spell on enemy
router.post('/spell', authenticate, playerSpell);

// POST /api/combat/defend
// Player defends against enemy attack
router.post('/defend', authenticate, playerDefend);




export default router;