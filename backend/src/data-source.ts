import "reflect-metadata";
import { DataSource } from "typeorm";
const dotenv = require("dotenv");
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: process.env.DB_LOGGING === "true",
    entities: ["src/entity/*.ts"], 
    migrations: ["src/migration/*.ts"], 
    subscribers: [],
    driver: require("mysql2"),
});
