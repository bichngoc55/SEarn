import axios from "axios";

const getArtistSong = async (accessToken, artistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const artistSong = response.data;
    return {
      tracks: artistSong.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
        })),
        album: {
            id: track.album.id,
            name: track.album.name,
            image: track.album.images[0].url,
          },
      })),
    };
  } catch (error) {
    console.error("Error fetching artist's album:", error);
    throw error;
  }
};

export { getArtistSong };
