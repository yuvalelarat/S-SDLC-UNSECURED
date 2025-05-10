import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.post("/reset-password-no-token", authController.resetPasswordWithoutToken)

router.post("/check-temp-password", authController.checkTempPassword);

export default router;
