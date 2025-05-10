import express from "express";
import authRouter from "./routes/auth.js";
import clientRouter from "./routes/clients.js";
import { AppDataSource } from "./config/data-source.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());

dotenv.config();

app.use(cors());

const port = process.env.PORT || 3000;

app.use("/api/auth", authRouter);
app.use("/api/clients", clientRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => console.error("Database connection error:", error));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
