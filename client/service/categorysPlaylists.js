import axios from "axios";

const getCategorysPlaylists = async (accessToken, categoryId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const categorysPlaylists = response.data;
    return {
      items: categorysPlaylists.playlists.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images.map((image)=>({
            url: image.url,
            height: image.height,
            width: image.width,
        }))
      })),
    };
  } catch (error) {
    console.error("Error fetching get Category's Playlists:", error);
    throw error;
  }
};

export { getCategorysPlaylists };
