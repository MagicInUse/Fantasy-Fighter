import { Sequelize } from "sequelize";
import { UserFactory } from "../models/user";

import dotenv from 'dotenv';
dotenv.config();

const adminSequelize = new Sequelize(
    'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

const sequelize = new Sequelize(
    process.env.DB_NAME || 'rpg_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

// Initialize User model
const User = UserFactory(sequelize);

(async () => {
    try {
        // Step 1: Verify database exists
        const dbName = process.env.DB_NAME || "rpg_db";
        const [results] = await adminSequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (!results.length) {
            console.log(`Database ${dbName} does not exist. Creating...`);
            await adminSequelize.query(`CREATE DATABASE "${dbName}"`); // Use quotes for safety
        } else {
            console.log(`Database ${dbName} exists.`);
        }

        // Step 2: Authenticate connection to target database
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Step 3: Sync models
        await sequelize.sync({ alter: true }); // Sync models with the database
        console.log("User model synced with the database.");
    } catch (err) {
        console.error("Error during database setup:", err);
    } finally {
        // Step 4: Close admin connection
        await adminSequelize.close();
    }
})();

export { sequelize, User };
export default sequelize;