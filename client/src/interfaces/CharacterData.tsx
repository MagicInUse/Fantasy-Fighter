import { ItemData } from './ItemData';

export interface CharacterData extends ItemData {
  username: string;
  sprite: string;
  level: number;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  inventory: ItemData[];
}