import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';
import { LevelData } from '../interfaces/LevelData';

import { apiPlayerAttack, apiPlayerDefend, apiPlayerSpell, createCharacterData, getCharacterData, getEnemyData } from '../api/combatAPI';
import { getLevelDetails } from '../api/levelAPI';

const Combat = () => {
  const { level_id } = useParams<{ level_id: string }>();
  const [player, setPlayer] = useState<CharacterData | null>(null);
  const [enemy, setEnemy] = useState<EnemyData | null>(null);
  const [level, setLevel] = useState<LevelData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch player data
        let playerData = await getCharacterData();
        
        // If player data doesn't exist, create a new character and fetch the data again
        if (!playerData) {
          await createCharacterData();
          playerData = await getCharacterData();
          console.log(playerData);
        }

        // Fetch level details
        // TODO: write a new interface for detailed level information
        // then update the getLevelDetails function to return that interface
        const levelData = await getLevelDetails(Number(level_id));

        // Fetch enemy data based on the enemy type from level details
        // TODO: update the getEnemyData function to accept a type parameter from level details
        const enemyData = await getEnemyData("Forest Ent");

        // Set state with fetched data
        setPlayer(playerData);
        setLevel(levelData);
        setEnemy(enemyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [level_id]);

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
      {player && enemy && level ? (
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
          <div className="level-info">
            <h2>{level.level_name}</h2>
            <p>{level.description}</p>
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