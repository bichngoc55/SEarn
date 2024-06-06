import express from "express";
import { getAccessToken } from "../controllers/userController.js";
import {
  login,
  changePassword,
  updateName,
  updateBackgroundImage,
  updateAvatar,
  upload,
  addLikedSongs,
  unlikedSongs,
  refresh,
  getLikedSongs,
  addLikedAlbums,
  unlikeAlbum,
  addLikedArtists,
  unlikeArtists,
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
// router.post("/register", register);
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
router.patch("/:id/addLikedSongs", authMiddleware, addLikedSongs);
router.patch("/:id/unlikeSongs", authMiddleware, unlikedSongs);
router.patch("/:id/addLikedAlbums", authMiddleware, addLikedAlbums);
router.patch("/:id/unlikeAlbum", authMiddleware, unlikeAlbum);
router.patch("/:id/addLikedArtists", authMiddleware, addLikedArtists);
router.patch("/:id/unlikeArtists", authMiddleware, unlikeArtists);
router.get("/:id/getLikedSongs", authMiddleware, getLikedSongs);
router.get("/:id/getLikedAlbums", authMiddleware, getLikedAlbums);
router.get("/:id/getLikedArtists", authMiddleware, getLikedArtist);

export default router;
