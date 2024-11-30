import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';
import { LevelDetailsData } from '../interfaces/LevelData';

import AuthService from '../utils/auth';
import { getLevelDetails } from '../api/levelAPI';

const Combat = () => {
  const { level_id } = useParams<{ level_id: string }>();
  const [player, setPlayer] = useState<CharacterData | null>(null);
  const [enemy, setEnemy] = useState<EnemyData | null>(null);
  const [level, setLevel] = useState<LevelDetailsData | null>(null);
  const [combatId, setCombatId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerMaxHealth, setPlayerMaxHealth] = useState<number>(0);
  const [playerMaxMana, setPlayerMaxMana] = useState<number>(0);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState<number>(0);
  const [enemyMaxMana, setEnemyMaxMana] = useState<number>(0);

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

  const handlePlayerFlee = () => {
    window.location.assign('/levels');
  };

  const calculatePercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  // Change to 'https://project-2-c43n.onrender.com' for deployment and 'http://localhost:5001' for local development
  const baseUrl = 'https://project-2-c43n.onrender.com';

  return (
    <div className="combat-container text-center mt-3">
      {player && enemy && level ? (
        <>
          <div className="battlefield card w-50 m-auto d-flex flex-row justify-content-between">
            <div className="player-info p-5 details-card">
              <h2>{player.username}</h2>
              <img src={`${baseUrl}${player.sprite}`} alt={player.username} className="m-3"/>
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
            <div className="enemy-info p-5 details-card">
              <h2>{enemy.name}</h2>
              <img src={`${baseUrl}${enemy.sprite}`} alt={enemy.name} className="m-3"/>
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
          <div className="message h2 text-center card w-50 m-auto mt-4 pt-2">
            <p>{message}</p>
          </div>
          <div className="combat-actions text-center mt-4">
            <button className="btn btn-danger mx-2" onClick={handlePlayerAttack}>Attack</button>
            <button className="btn btn-info mx-2" onClick={handlePlayerDefend}>Defend</button>
            <button className="btn btn-success mx-2" onClick={handlePlayerSpell}>Spell</button>
            <button className="btn btn-secondary mx-2" onClick={handlePlayerHeal}>Heal</button>
            <button className="btn btn-warning mx-2" onClick={handlePlayerFlee}>Flee</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Combat;