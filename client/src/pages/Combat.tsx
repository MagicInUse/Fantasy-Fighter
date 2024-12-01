import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';
import { LevelDetailsData } from '../interfaces/LevelData';

import AuthService from '../utils/auth';
import { getLevelDetails } from '../api/levelAPI';

const Combat = () => {
  // Get level_id from URL params
  const { level_id } = useParams<{ level_id: string }>();
  
  // Initialize state variables
  const [player, setPlayer] = useState<CharacterData | null>(null);
  const [enemy, setEnemy] = useState<EnemyData | null>(null);
  const [level, setLevel] = useState<LevelDetailsData | null>(null);
  const [combatId, setCombatId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerMaxHealth, setPlayerMaxHealth] = useState<number>(0);
  const [playerMaxMana, setPlayerMaxMana] = useState<number>(0);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState<number>(0);
  const [enemyMaxMana, setEnemyMaxMana] = useState<number>(0);

  // Ensure the value given is non-negative, returning 0 if it is
  // Used for health and mana values
  const ensureNonNegative = (value: number): number => {
    return value < 0 ? 0 : value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch level details
        const levelData = await getLevelDetails(Number(level_id));

        // Initialize combat session
        const response = await fetch('/api/combat/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify({ level_id: Number(level_id) }),
        });
        // Destructure response data
        const { message, combatId, player, enemy } = await response.json();

        // Set state with response data
        setPlayer(player);
        setPlayerMaxHealth(player.health);
        setPlayerMaxMana(player.mana);
        setEnemy(enemy);
        setEnemyMaxHealth(enemy.health);
        setEnemyMaxMana(enemy.mana);
        setLevel(levelData);
        setCombatId(combatId);
        setMessage(message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [level_id]);

  // POST /api/combat/attack endpoint to handle player attacking enemy
  const handlePlayerAttack = async () => {
    if (player && enemy && combatId) {
      console.log(`${player.username} is attacking`);
      try {
        const response = await fetch('/api/combat/attack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify({ combatId }),
        });
        const { updatedPlayer, updatedEnemy, message } = await response.json();
        setPlayer({
          ...updatedPlayer,
          health: ensureNonNegative(updatedPlayer.health),
          mana: ensureNonNegative(updatedPlayer.mana),
        });
        setEnemy({
          ...updatedEnemy,
          health: ensureNonNegative(updatedEnemy.health),
          mana: ensureNonNegative(updatedEnemy.mana),
        });
        setMessage(message);
      } catch (error) {
        console.error('Error during player attack:', error);
      }
    }
  };

  // POST /api/combat/defend endpoint to handle player defending against enemy
  const handlePlayerDefend = async () => {
    if (player && enemy && combatId) {
      console.log(`${player.username} is defending`);
      try {
        const response = await fetch('/api/combat/defend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify({ combatId }),
        });
        const { updatedPlayer, updatedEnemy, message } = await response.json();
        setPlayer({
          ...updatedPlayer,
          health: ensureNonNegative(updatedPlayer.health),
          mana: ensureNonNegative(updatedPlayer.mana),
        });
        setEnemy({
          ...updatedEnemy,
          health: ensureNonNegative(updatedEnemy.health),
          mana: ensureNonNegative(updatedEnemy.mana),
        });
        setMessage(message);
      } catch (error) {
        console.error('Error during player defend:', error);
      }
    }
  };

  // POST /api/combat/spell endpoint to handle player casting a spell on enemy
  const handlePlayerSpell = async () => {
    if (player && enemy && combatId) {
      console.log(`${player.username} is casting a spell`);
      try {
        const response = await fetch('/api/combat/spell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify({ combatId }),
        });
        const { updatedPlayer, updatedEnemy, message } = await response.json();
        setPlayer({
          ...updatedPlayer,
          health: ensureNonNegative(updatedPlayer.health),
          mana: ensureNonNegative(updatedPlayer.mana),
        });
        setEnemy({
          ...updatedEnemy,
          health: ensureNonNegative(updatedEnemy.health),
          mana: ensureNonNegative(updatedEnemy.mana),
        });
        setMessage(message);
      } catch (error) {
        console.error('Error during player spell:', error);
      }
    }
  };

  // POST /api/combat/heal endpoint to handle player healing themselves
  const handlePlayerHeal = async () => {
    if (player && enemy && combatId) {
      try {
        const response = await fetch('/api/combat/heal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify({ combatId }),
        });
        const { updatedPlayer, updatedEnemy, message } = await response.json();
        setPlayer({
          ...updatedPlayer,
          health: ensureNonNegative(updatedPlayer.health),
          mana: ensureNonNegative(updatedPlayer.mana),
        });
        setEnemy({
          ...updatedEnemy,
          health: ensureNonNegative(updatedEnemy.health),
          mana: ensureNonNegative(updatedEnemy.mana),
        });
        setMessage(message);
      } catch (error) {
        console.error('Error during player heal:', error);
      }
    }
  };

  // Flee back to the levels page
  const handlePlayerFlee = () => {
    window.location.assign('/levels');
  };

  // Calculate the percentage of current value to max value
  // Used for health and mana bars visual representation
  const calculatePercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="combat-container text-center mt-3">
      {player && enemy && level ? (
        <>
          {/* Battlefield container */}
          <div className="battlefield card w-50 m-auto d-flex flex-row justify-content-between"
          style={{ backgroundImage: level ? `url(${level.background_sprite})` : 'none' }}
          >
            {/* Player info section */}
            <div className="player-info p-5 details-card">
              <h2 className="text-shadow-bold">{player.username}</h2>
              <img src={`${player.sprite}`} alt={player.username} className="m-3"/>
              {/* Player health bar */}
              <div className="progress mb-2 position-relative custom-progress-bar">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${calculatePercentage(player.health, playerMaxHealth)}%` }}
                  aria-valuenow={player.health}
                  aria-valuemin={0}
                  aria-valuemax={playerMaxHealth}
                ></div>
                <span className="position-absolute w-100 text-center text-light">
                  Health: {player.health}
                </span>
              </div>
              {/* Player mana bar */}
              <div className="progress position-relative custom-progress-bar">
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${calculatePercentage(player.mana, playerMaxMana)}%` }}
                  aria-valuenow={player.mana}
                  aria-valuemin={0}
                  aria-valuemax={playerMaxMana}
                ></div>
                <span className="position-absolute w-100 text-center text-light">
                  Mana: {player.mana}
                </span>
              </div>
            </div>
            {/* Enemy info section */}
            <div className="enemy-info p-5 details-card">
              <h2 className="text-shadow-bold">{enemy.name}</h2>
              <img src={`${enemy.sprite}`} alt={enemy.name} className="m-3 enemy-sprite"/>
              {/* Enemy health bar */}
              <div className="progress mb-2 position-relative custom-progress-bar">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${calculatePercentage(enemy.health, enemyMaxHealth)}%` }}
                  aria-valuenow={enemy.health}
                  aria-valuemin={0}
                  aria-valuemax={enemyMaxHealth}
                ></div>
                <span className="position-absolute w-100 text-center text-light">
                  Health: {enemy.health}
                </span>
              </div>
              {/* Enemy mana bar */}
              <div className="progress position-relative custom-progress-bar">
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${calculatePercentage(enemy.mana, enemyMaxMana)}%` }}
                  aria-valuenow={enemy.mana}
                  aria-valuemin={0}
                  aria-valuemax={enemyMaxMana}
                ></div>
                <span className="position-absolute w-100 text-center text-light">
                  Mana: {enemy.mana}
                </span>
              </div>
            </div>
          </div>
          {/* Message display */}
          <div className="message h2 text-center card w-50 m-auto mt-4 pt-2">
            <p>{message}</p>
          </div>
          {/* Combat action buttons */}
          <div className="combat-actions text-center mt-4">
            <button className="btn btn-danger mx-2" onClick={handlePlayerAttack}>Attack</button>
            <button className="btn btn-info mx-2" onClick={handlePlayerDefend}>Defend</button>
            <button className="btn btn-success mx-2" onClick={handlePlayerSpell}>Spell</button>
            <button className="btn btn-secondary mx-2" onClick={handlePlayerHeal}>Heal</button>
            <button className="btn btn-warning mx-2" onClick={handlePlayerFlee}>Flee</button>
          </div>
        </>
      ) : (
        <>
          {/* Loading message */}
          <div className="text-center">
            <p>Loading...</p>
            <p>If loading takes longer than 10 seconds, log out and log back in.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Combat;