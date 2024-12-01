export interface ItemData {
    id: number;
    itemName: string;
    description: string;
    quantity: number;
    type: number;
    equipped?: boolean;
    damage?: number;
    effect?: string;
    characterId?: number;
}