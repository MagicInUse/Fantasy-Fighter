import sequelize from "../config/database";
import { Model, DataTypes } from "sequelize";

interface CharacterAttributes {
    id: number;
    characterName: string;
    level: number;
    health: number;
    mana: number;
    currentWeapon: string;
    //armor: string; 
}

export class Character extends Model<CharacterAttributes> implements CharacterAttributes {
    public id!: number;
    public characterName!: string;
    public level!: number;
    public health!: number;
    public mana!: number;
    public currentWeapon!: string;
    //public armor!: string;
}

export function CharacterFactory(sequelize: typeof Sequelize): typeof Character {
    Character.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            characterName: {
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
 
        },
        {
            modelName: 'Character',
            sequelize,
        }
    );
    return Character;
}
