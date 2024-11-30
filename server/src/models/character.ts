import { Sequelize, Model, DataTypes, Optional } from "sequelize"; // Added Sequelize
import { Item } from "./index";
import sequelize from "../config/database";

// Define a plain interface for inventory items
interface InventoryItem {
    id: number;
    itemName: string;
    type: number;
    quantity: number;
    damage?: number;
    effect?: string;
    description: string;
    equipped?: boolean | null;
    characterId?: number | null;
    level_id?: number | null;
}

interface CharacterAttributes {
    id: number;
    userId: number;
    username: string;
    characterName: string;
    sprite: string;
    level: number;
    health: number;
    mana: number;
    currentWeapon: string;
    attack: number;
    defense: number;
    inventory: InventoryItem[];
    // armor: string; 
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes, "id"> {}

export class Character extends Model<CharacterAttributes, CharacterCreationAttributes> implements CharacterAttributes {
    public id!: number;
    public userId!: number;
    public username!: string;
    public characterName!: string;
    public sprite!: string;
    public level!: number;
    public health!: number;
    public mana!: number;
    public currentWeapon!: string;
    public attack!: number;
    public defense!: number;
    public inventory!: InventoryItem[];
    // public armor!: string;

    // Association Methods
    public addItem!: (item: Item | Item[]) => Promise<void>;
    public getItems!: () => Promise<Item[]>;
    public removeItem!: (item: Item | Item[]) => Promise<void>;
    public items?: Item[];
}

export function CharacterFactory(sequelize: Sequelize): typeof Character {
    Character.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            characterName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sprite: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            health: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mana: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            currentWeapon: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            attack: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            defense: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            inventory: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
        },
        {
            modelName: 'Character',
            tableName: 'characters',
            timestamps: false,
            sequelize,
        }
    );
    return Character;
}
