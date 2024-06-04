import express from "express";
import {
  getAllPlaylists,
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistDetails,
  getUserLikePlaylist,
  getAllPublicPlaylist,
} from "../controllers/playlistController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* READ */
router.get("/public", getAllPublicPlaylist);
router.get("/", getAllPlaylists);
router.get("/:id", authMiddleware, getPlaylistDetails);
router.get("/liked/:id", getUserLikePlaylist);
// router.put("/liked/:id", likeUnlikePlaylist);
/* CREATE */
router.post("/add", addPlaylist);

/* UPDATE */
router.patch("/:id", authMiddleware, updatePlaylist);

/* DELETE */
router.delete("/:id", authMiddleware, deletePlaylist);

export default router;
