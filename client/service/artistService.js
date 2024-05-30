import axios from "axios";

const getArtist = async (accessToken, artistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const artist = response.data;
    return {
      name: artist.name,
      id: artist.id,
      genres: artist.genres.map((genre)=>({
        typeGenre: genre
      })),
      images: artist.images.map((image) => ({
        url: image.url,
        height: image.height,
        width: image.width,
      })),
    };
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
};

export { getArtist };
