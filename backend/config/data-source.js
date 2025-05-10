import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../models/userModel.js";
import Client from "../models/clientModels.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "project",
  entities: [User, Client],
  synchronize: true,
});
