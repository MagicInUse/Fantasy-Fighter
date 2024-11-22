
export interface Item {
    id: number;
    itemName: string;
    type: number
    quantity: number;
    damage?: number;
    effect?: string;
}

export const items: Item[] = [
    { id: 1, itemName: 'Bow', type: 1, quantity: 1, damage: Math.floor(Math.random() * 10) + 1 },
    { id: 2, itemName: 'Sword', type: 1, quantity: 1, damage: Math.floor(Math.random() * 6) + 3 },
    { id: 3, itemName: 'Potion', type: 2, quantity: 5, effect: 'Heals 10 health' },
    { id: 4, itemName: 'Mana Potion', type: 2, quantity: 5, effect: 'Restores 10 mana' },   
];