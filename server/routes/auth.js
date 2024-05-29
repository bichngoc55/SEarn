import express from "express";
import { getAccessToken } from "../controllers/userController.js";
import {
  login,
  register,
  changePassword,
  updateName,
  updateBackgroundImage,
  updateAvatar,
  upload,
  updateLikedSongs,
  refresh,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refresh);
router.get("/getAccessToken", getAccessToken);
router.post("/login", login);
router.post("/register", register);
router.post("/changePassword", authMiddleware, changePassword);
router.post("/refresh", refresh);
router.patch("/name", authMiddleware, updateName);
router.patch(
  "/backgroundImage",
  authMiddleware,
  // upload.single("backgroundImage"),
  updateBackgroundImage
);

router.patch("/ava", authMiddleware, updateAvatar);
router.patch("/likedSongs", authMiddleware, updateLikedSongs);
export default router;
