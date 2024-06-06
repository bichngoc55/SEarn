import axios from "axios";

const getAlbumTrack = async (accessToken, albumId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const albumTracks = response.data;
    return {
      total:albumTracks.total,
      items: albumTracks.items.map((item) => ({ 
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
        })),
        preview_url: item.preview_url,
      })),
    };
  } catch (error) {
    console.error("Error fetching album's top tracks:", error);
    throw error;
  }
};

export { getAlbumTrack };
