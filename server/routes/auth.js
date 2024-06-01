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
  getLikedSongs,
  updateLikedAlbums,
  updateLikedArtist,
  getLikedAlbums,
  getLikedArtist,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refresh);
router.get("/getAccessToken", getAccessToken);
router.post("/login", login);
router.post("/register", register);
router.post("/changePassword", authMiddleware, changePassword);
router.post("/refresh", refresh);
router.patch("/:id/name", authMiddleware, updateName);
router.patch(
  "/:id/backgroundImage",
  authMiddleware,
  // upload.single("backgroundImage"),
  updateBackgroundImage
);

router.patch("/ava", authMiddleware, updateAvatar);
router.patch("/:id/updateLikedSongs", authMiddleware, updateLikedSongs);
router.patch("/:id/updateLikedAlbums", authMiddleware, updateLikedAlbums);
router.patch("/:id/updateLikedArtists", authMiddleware, updateLikedArtist);
router.get("/:id/getLikedSongs", authMiddleware, getLikedSongs);
router.get("/:id/getLikedAlbums", authMiddleware, getLikedAlbums);
router.get("/:id/getLikedArtists", authMiddleware, getLikedArtist);

export default router;
