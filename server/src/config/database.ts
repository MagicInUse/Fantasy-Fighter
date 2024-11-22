import dotenv from 'dotenv';
dotenv.config();

// Import and initialize models and associations
import "../models";

import { Sequelize } from "sequelize";
import { sequelize } from "../models"; // Import the Sequelize instance from models/index.ts

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

(async () => {
    try {
        // Verify database exists
        const dbName = process.env.DB_NAME || "rpg_db";
        const [results] = await adminSequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (!results.length) {
            console.log(`Database ${dbName} does not exist. Creating...`);
            await adminSequelize.query(`CREATE DATABASE "${dbName}"`); 
        } else {
            console.log(`Database ${dbName} exists.`);
        }

        // Authenticate connection to target database
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync all models
        await sequelize.sync({ alter: true }); // Sync models with the database
        console.log("All models synced with the database.");
    } catch (err) {
        console.error("Error during database setup:", err);
    } finally {
        // Close admin connection
        await adminSequelize.close();
    }
})();

export { sequelize };
export default sequelize;
