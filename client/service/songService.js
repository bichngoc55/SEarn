import axios from "axios";

const getTrack = async (accessToken, songId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const track = response.data;
    return {
      name: track.name,
      id: track.id,
      artists: track.artists.map((artist) => ({
        name: artist.name,
        id: artist.id,
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        image: track.album.images[0].url,
      },
      preview_url: track.preview_url,
    };
  } catch (error) {
    
    throw error;
  }
};

export { getTrack };
