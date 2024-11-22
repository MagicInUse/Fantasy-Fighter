import { Model, DataTypes, Sequelize } from "sequelize";
import { Level } from "./level";

interface EnemyAttributes {
    health: number;
    damage: number;
    level_id?: number;
}

export class Enemy extends Model<EnemyAttributes> implements EnemyAttributes {
    public health!: number;
    public damage!: number;
    public level_id!: number;
}
export function EnemyFactory(sequelize: Sequelize): typeof Enemy {

    Enemy.init(
        {
            health: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            damage: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            level_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'level',
                    key: 'level_id',

                },
            },
        },
        {
            modelName: 'Enemy',
            sequelize,
        }
    );
    return Enemy;
}