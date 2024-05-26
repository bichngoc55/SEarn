import express from "express";
import {
  getAllPlaylists,
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistDetails,
} from "../controllers/playlistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

/* READ */
router.get("/", authMiddleware, getAllPlaylists);
router.get("/:id", authMiddleware, getPlaylistDetails);

/* CREATE */
router.post("/add", addPlaylist);

/* UPDATE */
router.patch("/:id", authMiddleware, updatePlaylist);

/* DELETE */
router.delete("/:id", authMiddleware, deletePlaylist);

export default router;
