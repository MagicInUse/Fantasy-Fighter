import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface EnemyAttributes {
    enemy_id: number;
    type: string;
    health: number;
    damage: number;
    level_id?: number;
}

interface EnemyCreationAttributes extends Optional<EnemyAttributes, "enemy_id"> {}

export class Enemy extends Model<EnemyAttributes, EnemyCreationAttributes> implements EnemyAttributes {
    public enemy_id!: number;
    public type!: string;
    public health!: number;
    public damage!: number;
    public level_id!: number;
}

export function EnemyFactory(sequelize: Sequelize): typeof Enemy {

    Enemy.init(
        {
            enemy_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
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
                    model: 'levels',
                    key: 'level_id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            modelName: 'Enemy',
            tableName: 'enemies',
            sequelize,
            timestamps: false,
        }
    );
    return Enemy;
}
