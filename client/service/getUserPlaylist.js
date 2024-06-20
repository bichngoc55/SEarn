const getUserPlaylist = async (userId) => {
  try {
    console.log("goi playlist tu db: ");
    const response = await fetch(
      "https://bf40-2405-4802-a39b-a4d0-b040-fdd4-ec8a-4ef.ngrok-free.app/playlists/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Lọc các playlist có userIdOwner khớp với userId được truyền vào
    const playlists = await response.json();
    console.log("goi playlist tu db: " + playlists);
    const filteredPlaylists = playlists.filter(
      (playlist) => playlist.userIdOwner === userId
    );
    console.log("goi playlist tu db: " + filteredPlaylists);

    return filteredPlaylists.map((item) => ({
      id: item.id,
      name: item.name,
      userIdOwner: item.userIdOwner,
      description: item.description,
      imageURL: item.imageURL,
      privacyOrPublic: item.privacyOrPublic,
      songCount: item.songCount,
      songIdList: item.songs,
      numberOfLikes: item.numberOfLikes,
      listUserIdLikes: item.listUserIdLikes,
    }));
  } catch (error) {
    console.error("Error (ở service/getUserplaylist):", error);
    throw error;
  }
};
export { getUserPlaylist };
