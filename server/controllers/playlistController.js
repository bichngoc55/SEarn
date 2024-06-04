import Playlist from "../models/playlist.js";

// Get all playlists
export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all playlists" });
  }
};
export const getAllPublicPlaylist = async (req, res) => {
  try {
    console.log("heheheh");
    const playlists = await Playlist.find({ privacyOrPublic: true });
    console.log("public playlist: " + playlists);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all playlists" });
  }
};

// Add a new playlist
export const addPlaylist = async (req, res) => {
  console.log(req.body);
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to add playlist" });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

// Update a playlist
export const updatePlaylist = async (req, res) => {
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

export const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to get playlist details" });
  }
};

export const getUserLikePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id: " + id);
    const likedPlaylists = await Playlist.find({
      listUserIdLikes: id,
    });
    console.log("likedPlaylist: " + likedPlaylists);
    res.status(200).json(likedPlaylists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const likeUnlikePlaylist = async (req, res) => {
//   try {
//     const playlistId = req.params.id;
//     console.log("red body: " + req.body);
//     const { userId } = req.body;

//     const playlist = await Playlist.findById(playlistId);

//     if (!playlist) {
//       return res.status(404).json({ message: "Playlist not found" });
//     }

//     const isLiked = playlist.listUserIdLikes.includes(userId);
//     console.log("isLiked :" + isLiked);
//     if (isLiked) {
//       playlist.listUserIdLikes = playlist.listUserIdLikes.filter(
//         (id) => id.toString() !== userId
//       );
//       playlist.numberOfLikes -= 1;
//       console.log("numberOfLikes : " + playlist.numberOfLikes);

//     } else {
//       playlist.listUserIdLikes.push(userId);
//       playlist.numberOfLikes += 1;
//       console.log("numberOfLikes : " + playlist.numberOfLikes);

//     }

//     const updatedPlaylist = await playlist.save();
//     if(playlist.numberOfLikes>=5)
//     {
//       await
//     }
//      User.findById(userId, (err, user) => {
//       if (err) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       user.userCoin = ;
//       user.save();
//     });

//     res.status(200).json({ updatedPlaylist, userCoin });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
