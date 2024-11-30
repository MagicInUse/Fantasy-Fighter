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
        setLevel(levelData);
        setEnemy(enemy);
        setCombatId(combatId);
        setMessage(message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
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
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
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
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
        setMessage(message);
      } catch (error) {
        console.error('Error during player spell:', error);
      }
    }
  };

  const handlePlayerFlee = () => {
    window.location.assign('/levels');
  };

  return (
    <div className="combat-container">
      {player && enemy && level ? (
        <>
          <div className="battlefield card w-50 m-auto d-flex flex-row justify-content-between text-center">
            <div className="player-info p-5">
              <h2>{player.username}</h2>
              <img src={`${player.sprite}`} alt={player.username} className="m-3"/>
              <p>Health: {player.health}</p>
              <p>Mana: {player.mana}</p>
            </div>
            <div className="enemy-info p-5">
              <h2>{enemy.name}</h2>
              <img src={enemy.sprite} alt={enemy.name} className="m-3"/>
              <p>Health: {enemy.health}</p>
              <p>Mana: {enemy.mana}</p>
            </div>
          </div>
          <div className="message h2 text-center card w-50 m-auto pt-2">
            <p>{message}</p>
          </div>
          <div className="combat-actions text-center mt-4">
            <button className="btn btn-danger mx-2" onClick={handlePlayerAttack}>Attack</button>
            <button className="btn btn-info mx-2" onClick={handlePlayerDefend}>Defend</button>
            <button className="btn btn-success mx-2" onClick={handlePlayerSpell}>Spell</button>
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