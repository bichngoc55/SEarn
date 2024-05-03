import express from "express";
import {
  login,
  register,
  refresh,
  linkSpotifyAccount,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/spotify/callback", linkSpotifyAccount);

export default router;
