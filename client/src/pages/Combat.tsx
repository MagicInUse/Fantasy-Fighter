import { useEffect, useState } from 'react';

import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';

import { apiPlayerAttack, apiPlayerDefend, apiPlayerSpell, getCharacterData, getEnemyData } from '../api/combatAPI.tsx';

const Combat = () => {
  const [player, setPlayer] = useState<CharacterData | null>(null);
  const [enemy, setEnemy] = useState<EnemyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerData = await getCharacterData();
        const enemyData = await getEnemyData();
        setPlayer(playerData);
        setEnemy(enemyData);
      } catch (error) {
        console.error('Error fetching player & enemy data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePlayerAttack = async () => {
    if (player && enemy) {
      console.log(`${player.username} is attacking`);
      try {
        const { updatedPlayer, updatedEnemy } = await apiPlayerAttack(player, enemy);
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
      } catch (error) {
        console.error('Error during player attack:', error);
      }
    }
  };

  const handlePlayerDefend = async () => {
    if (player && enemy) {
      console.log(`${player.username} is defending`);
      try {
        const { updatedPlayer, updatedEnemy } = await apiPlayerDefend(player, enemy);
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
      } catch (error) {
        console.error('Error during player defend:', error);
      }
    }
  };

  const handlePlayerSpell = async () => {
    if (player && enemy) {
      console.log(`${player.username} is casting a spell`);
      try {
        const { updatedPlayer, updatedEnemy } = await apiPlayerSpell(player, enemy);
        setPlayer(updatedPlayer);
        setEnemy(updatedEnemy);
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
      {player && enemy ? (
        <>
          <div className="player-info">
            <h2>{player.username}</h2>
            <img src={player.sprite} alt={player.username} />
            <p>Health: {player.health}</p>
            <p>Mana: {player.mana}</p>
          </div>
          <div className="enemy-info">
            <h2>{enemy.name}</h2>
            <img src={enemy.sprite} alt={enemy.name} />
            <p>Health: {enemy.health}</p>
            <p>Mana: {enemy.mana}</p>
          </div>
          <div className="combat-actions">
            <button className="btn btn-danger" onClick={handlePlayerAttack}>Attack</button>
            <button className="btn btn-info" onClick={handlePlayerDefend}>Defend</button>
            <button className="btn btn-success" onClick={handlePlayerSpell}>Spell</button>
            <button className="btn btn-warning" onClick={handlePlayerFlee}>Flee</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Combat;