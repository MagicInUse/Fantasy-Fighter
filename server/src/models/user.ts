import sequelize from "../config/database";
import { Model, DataTypes } from "sequelize";

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
}

export function UserFactory(sequelize: typeof Sequelize): typeof User {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            modelName: 'User',
            sequelize,
        }
    );

    return User;
}