import express from "express";
import { getAccessToken } from "../controllers/userController.js";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refresh);
router.get("/getAccessToken", getAccessToken);

export default router;
