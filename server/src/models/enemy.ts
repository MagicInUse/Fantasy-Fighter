import { Model, DataTypes } from "sequelize";

interface EnemyAttributes {
    health: number;
    damage: number;
}

export class Enemy extends Model<EnemyAttributes> implements EnemyAttributes {
    public health!: number;
    public damage!: number;
}
export function EnemyFactory(sequelize: typeof Sequelize): typeof Enemy {

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
        },
        {
            modelName: 'Enemy',
            sequelize,
        }
    );
    return Enemy;
}