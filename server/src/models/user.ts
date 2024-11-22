import { Sequelize, Model, DataTypes, Optional } from "sequelize";

// Define attributes for the User
interface UserAttributes {
    id: number;
    username: string;
    password: string;
}

// Make id optional for UserCreationAttributes
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
}

// Factory function to define the model
export function UserFactory(sequelize: Sequelize): typeof User {
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
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            modelName: "User",
            sequelize,
        }
    );

    return User;
}
