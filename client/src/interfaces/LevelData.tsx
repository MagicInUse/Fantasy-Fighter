import { ItemData } from './ItemData';

export interface LevelData extends ItemData {
  level_id: number;
  level_name: string;
  loot_table: ItemData[];
  description: string;
  complete: boolean;
  locked: boolean;
}

export interface LevelDetailsData extends ItemData {
  level_id: number;
  level_name: string;
  loot_table: ItemData[];
  description: string;
  complete: boolean;
  locked: boolean;
  loot: ItemData[];
  enemyDetails: object;
}