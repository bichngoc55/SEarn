const Playlist = require("../models/playlist");

// Get all playlists
const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all playlists" });
  }
};

// Add a new playlist
const addPlaylist = async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to add playlist" });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

// Update a playlist
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to update playlist" });
  }
};

// Get details of a playlist
const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to get playlist details" });
  }
};

module.exports = {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistDetails,
};
