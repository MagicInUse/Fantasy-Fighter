import express, { Request, Response } from 'express';
import { Character, Enemy, Level, Item } from '../models/index'; // Added Level
import { authenticate } from './middleware/auth';
import { ItemFactory } from '../models/item'; // Import ItemFactory

const router = express.Router();

const combatSessions: { [key: string]: { player: any; enemy: any; level_id: number; turn: string } } = {};

// Fetch player data for combat
export const getPlayerData = async (userId: number): Promise<any> => {
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
            level_id,
            turn: "player",
        };

        res.status(200).json({ message: "Combat session started.", combatId, player, enemy });
    } catch (error) {
        console.error("Error initializing combat session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


const handleEnemyDefeat = async (combatId: string, combat: any, messages: string[], res: Response): Promise<void> => {
    try {
        const { level_id, player } = combat;
        const level = await Level.findOne({ where: { level_id } });

        if (level && !level.complete) {
            const character = await Character.findOne({ where: { id: player.id } });
            if (character) {
                character.level += 1;
                level.complete = true;
                const attackIncrements = [3, 5, 8, 12, 15];
                const attackThresholds = [20, 25, 35, 50];
                for (let i = 0; i < attackThresholds.length; i++) {
                    if (character.attack < attackThresholds[i]) {
                        character.attack += attackIncrements[i];
                        break;
                    }
                }
                if (character.attack >= 50) {
                    character.attack += attackIncrements[4];
                }
                character.defense = Math.min(character.defense + 4, 20);
                character.mana = character.mana < 50 ? character.mana + 10 : Math.min(character.mana + 5, 100);
                character.health += Math.min(70, 30 + Math.floor((character.health - 100) / 50) * 10);

                const newWeaponName = level.loot_table ? (level.loot_table[0] as { itemName: string }).itemName : null;
                if (newWeaponName) {
                    const loot = await Item.findOne({ where: { itemName: newWeaponName } });
                    if (loot) {
                        // Create and persist the new weapon
                        const newWeapon = await ItemFactory(loot.sequelize).create({
                            itemName: loot.itemName,
                            description: loot.description,
                            quantity: loot.quantity,
                            type: loot.type,
                            equipped: loot.equipped,
                            damage: loot.damage,
                            effect: loot.effect,
                            characterId: character.id,
                        });

                        const inventory = await character.getItems();

                        // Equip the new weapon
                        character.currentWeapon = newWeaponName;
                        combat.player.currentWeapon = newWeaponName;
                    }
                }

                await character.save();
                await level.save();

                // Unlock the next level
                const nextLevelId = level.level_id + 1;
                const nextLevel = await Level.findOne({ where: { level_id: nextLevelId } });
                if (nextLevel && nextLevel.locked) {
                    nextLevel.locked = false;
                    await nextLevel.save();
                }
            }
        }
    } catch (error) {
        console.error("Error updating character level, level completion, and unlocking next level:", error);
    }

    delete combatSessions[combatId];
    messages.push("Victory! You defeated the enemy.");
    res.status(200).json({ message: messages.join(' '), updatedPlayer: combat.player, updatedEnemy: combat.enemy });
};

const calculateDamage = async (character: any): Promise<number> => {
    if (!character.currentWeapon) {
        console.log("Character has no weapon equipped. Throwing a punch.");
        return character.attack;
    }

    // Fetch the weapon from the database by itemName
    const weapon = await Item.findOne({ where: { itemName: character.currentWeapon } });

    if (!weapon) {
        console.log("Weapon not found in database. Using base attack.");
        return character.attack;
    }

    // Use weapon's damage value
    let weaponDamage = weapon.damage || 0;

    // Introduce 20% variation
    const variation = weaponDamage * 0.2;
    const minDamage = Math.floor(weaponDamage - variation);
    const maxDamage = Math.ceil(weaponDamage + variation);

    // Calculate random weapon damage within the range
    weaponDamage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;

    // 10% chance to double the damage
    if (Math.random() < 0.1) {
        weaponDamage *= 2;
    }

    // Ensure weaponDamage is a whole number
    weaponDamage = Math.round(weaponDamage);

    // Return the total damage
    return weaponDamage;
};

// Enemy attacks player
const enemyTurn = (combat: any): { message: string; updatedPlayer: any; updatedEnemy: any } => {
    // Determine enemy action (85% attack, 15% defend)
    const action = Math.random() < 0.85 ? "attack" : "defend";
    
    if (combat.enemy.defense >= 5) {
        combat.enemy.defense -= 5; // Reset defense boost
    }

    if (action === "attack") {
        const damage = combat.enemy.attack;
        const variation = damage * 0.2;
        const minDamage = Math.floor(damage - variation);
        const maxDamage = Math.ceil(damage + variation);
        const actualDamage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        combat.player.health -= Math.max(actualDamage - combat.player.defense, 0);

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

// Adjust playerAttack function to await calculateDamage
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
    const damage = await calculateDamage(combat.player);
    const actualDamage = Math.max(damage - combat.enemy.defense, 0);
    combat.enemy.health -= actualDamage;

    let messages = [`You attacked for ${damage} damage.`];

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        await handleEnemyDefeat(combatId, combat, messages, res);
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
        await handleEnemyDefeat(combatId, combat, messages, res);
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

    // Check if the enemy is defeated
    if (combat.enemy.health <= 0) {
        await handleEnemyDefeat(combatId, combat, messages, res);
        return;
    }
    
    res.status(200).json({
        message: messages.join(' '),
        updatedPlayer: combat.player,
        updatedEnemy: combat.enemy,
    });
};

// Add heal spell function
const playerHeal = async (req: Request, res: Response): Promise<void> => {
    const { combatId } = req.body;
    const userId = req.user.id;

    const combat = combatSessions[combatId];
    if (!combat) {
        res.status(404).json({ error: "Combat session not found." });
        return;
    }

    if (combat.turn !== "player") {
        res.status(400).json({ error: "It's not your turn." });
        return;
    }

    if (combat.player.mana < 5) {
        res.status(400).json({ error: "Not enough mana to cast heal." });
        return;
    }

    const player = await getPlayerData(userId);

    const maxHealth = player.health;
    let healAmount = Math.floor(maxHealth * (0.35 + Math.random() * 0.3));
    if (Math.random() < 0.1) {
        healAmount *= 2;
    }
    combat.player.health = Math.min(combat.player.health + healAmount, maxHealth);
    combat.player.mana -= 5;

    let messages = [`You cast a heal spell and restored ${healAmount} health.`];

    // Update turn to enemy
    combat.turn = "enemy";

    // Execute enemy turn
    const enemyResult = enemyTurn(combat);
    messages.push(enemyResult.message);

    // Check if the player is defeated during enemy's turn
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

// Add route for heal spell
router.post('/heal', authenticate, playerHeal);

export default router;