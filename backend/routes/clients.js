import express from "express";
import * as clientsController from "../controllers/clientsController.js";

const router = express.Router();

router.get("/", clientsController.getAllClients);

router.post("/create", clientsController.createClient);

export default router;
