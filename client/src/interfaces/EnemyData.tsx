import { ItemData } from './ItemData';

export interface EnemyData extends ItemData {
  name: string;
  sprite: string;
  level: number;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  lootTable: ItemData[];
}