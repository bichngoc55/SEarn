import axios from "axios";

const getArtistAlbum = async (accessToken, artistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const artistAlbum = response.data;
    return {
      items: artistAlbum.items.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.images.map((image)=>({
            url: image.url,
            height: image.height,
            width: image.width,
        }))
      })),
    };
  } catch (error) {
    console.error("Error fetching artist's album:", error);
    throw error;
  }
};

export { getArtistAlbum };
