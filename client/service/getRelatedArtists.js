import axios from "axios";

const getRelatedArtists = async (accessToken, artistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const relatedArtists = response.data;
    const limitedArtists = relatedArtists.artists
      .slice(0, 5) // Giới hạn chỉ lấy 10 nghệ sĩ
      .map((artist) => ({
        id: artist.id,
        name: artist.name,
        images: artist.images.map((image) => ({
          url: image.url,
          height: image.height,
          width: image.width,
        })),
        genres: artist.genres.map((genre) => ({
          typeGenre: genre,
        })),
      }));

    return {
      artists: limitedArtists,
    };
  } catch (error) {
    console.error("Error fetching Get Artist's Related Artists:", error);
    throw error;
  }
};

export { getRelatedArtists };