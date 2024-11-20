import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Level extends Model {}

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
         enemy: {
            type: DataTypes.STRING(50),
            allowNull: false,
         },
         enemy_stats: {
            type: DataTypes.JSONB,
            allowNull: false,
         },
         loot_table: {
            type: DataTypes.JSONB,
            allowNull: true,
         },
         description: {
            type: DataTypes.STRING(255),
            allowNull: true,
         }
    },
    {
        sequelize,
        modelName: 'Level',
        tableName: 'levels',
        timestamps: false,
    }
);

export default Level;