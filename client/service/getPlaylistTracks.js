import axios from "axios";

const getPlaylistTracks = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); 

    const playlistData = response.data;
    return {
      items: playlistData.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
        album: {
          id: item.track.album.id,
          name: item.track.album.name,
          image: item.track.album.images[0].url,
        },
        preview_url: item.track.preview_url,
      })),
    };
  } catch (error) {
    console.error("Error fetching Get Playlist Items:", error);
    throw error;
  }
};

export { getPlaylistTracks };
