import { Sequelize, Model, DataTypes, Optional } from "sequelize"; // Added Sequelize

interface ItemAttributes {
    id: number;
    itemName: string;
    type: number;
    quantity: number;
    damage?: number;
    effect?: string;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, "id"> {}

export class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
    public id!: number;
    public itemName!: string;
    public type!: number;
    public quantity!: number;
    public damage?: number;
    public effect?: string;
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
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            sequelize,
        }
    );
    return Item;
}
