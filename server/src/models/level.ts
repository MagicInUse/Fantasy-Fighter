import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LevelAttributes {
    level_id: number;
    level_name: string;
    loot_table: object[] | null; // Changed from object | null to object[] | null
    description: string | null;
    complete: boolean;
    locked: boolean;
}

interface LevelCreationAttributes extends Optional<LevelAttributes, "level_id"> {}

export class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
    public level_id!: number;
    public level_name!: string;
    public loot_table!: object[] | null;
    public description!: string | null;
    public complete!: boolean;
    public locked!: boolean;
}

export function LevelFactory(sequelize: Sequelize): typeof Level {
    Level.init(
        {
            level_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            level_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            loot_table: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            complete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            locked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Level',
            tableName: 'levels',
            timestamps: false,
        }
    );

    return Level;
}
