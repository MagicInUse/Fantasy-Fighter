import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface EnemyAttributes {
    enemy_id: number;
    name: string;
    sprite: string;
    level_id?: number;
    type: string;
    health: number;  
    mana: number;
    attack: number;
    defense: number;
}

interface EnemyCreationAttributes extends Optional<EnemyAttributes, "enemy_id"> {}

export class Enemy extends Model<EnemyAttributes, EnemyCreationAttributes> implements EnemyAttributes {
    public enemy_id!: number;
    public name!: string;
    public sprite!: string;
    public level_id!: number;
    public type!: string;
    public health!: number;   
    public mana!: number;
    public attack!: number;
    public defense!: number;
}

export function EnemyFactory(sequelize: Sequelize): typeof Enemy {

    Enemy.init(
        {
            enemy_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            sprite: {
                type: DataTypes.STRING(255),
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
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            health: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mana: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            attack: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            defense: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
