import { ItemData } from './ItemData';

export interface LevelData extends ItemData {
  levelNumber: number;
  levelName: string;
  description: string;
  lootTable: ItemData[];
  complete: boolean;
  locked: boolean;
}