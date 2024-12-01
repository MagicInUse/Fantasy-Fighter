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
    characterId?: number;
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
    public characterId?: number;

    public getCharacters!: () => Promise<Character[]>;
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
            characterId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'characters',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

