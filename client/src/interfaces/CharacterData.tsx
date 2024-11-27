import { ItemData } from './ItemData';

export interface CharacterData extends ItemData {
  id: number;
  userId: number;
  username: string;
  characterName: string;
  sprite: string;
  level: number;
  health: number;
  mana: number;
  currentWeapon: ItemData;
  attack: number;
  defense: number;
  inventory: ItemData[];
}