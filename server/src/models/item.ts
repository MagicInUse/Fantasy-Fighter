import { Sequelize, Model, DataTypes, Optional } from "sequelize"; // Added Sequelize
import { Character } from "./index";

interface ItemAttributes {
    id: number;
    itemName: string;
    description: string;
    quantity: number;
    type: number;
    equipped?: boolean;
    damage?: number;
    effect?: string;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, "id"> {}

export class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
    public id!: number;
    public itemName!: string;
    public description!: string;
    public quantity!: number;
    public type!: number;
    public equipped?: boolean;
    public damage?: number;
    public effect?: string;

    public getCharacters!: () => Promise<Character[]>;
    public calculateDamage(): number {
        switch (this.itemName) {
            case 'Bow':
                return Math.floor(Math.random() * 10) + 1;
            case 'Sword':
                return Math.floor(Math.random() * 6) + 3;
            case 'Laser Gun':
                return Math.floor(Math.random() * 46) + 5;
            default:
                return 1;
        }
    }
}

export function ItemFactory(sequelize: Sequelize): typeof Item { // Changed typeof Sequelize to Sequelize
    Item.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            equipped: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            damage: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            effect: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            modelName: 'Item',
            tableName: 'items',
            timestamps: false,
            sequelize,
        }
    );
    return Item;
}
