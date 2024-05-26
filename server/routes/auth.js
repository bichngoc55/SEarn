import express from "express";
import { getAccessToken } from "../controllers/userController.js";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refresh);
router.get("/getAccessToken", getAccessToken);
router.post("/login", login);
router.post("/register", register);

export default router;
