import axios from "axios";

const getAlbumsNewReleases = async (accessToken) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/new-releases`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const albumsNewReleases = response.data;

    return {
      items: albumsNewReleases.albums.items.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.images.map((image) => ({
          url: image.url,
          height: image.height,
          width: image.width,
        })),
      })),
    };
  } catch (error) {
    // console.error("Error fetching albums new releases:", error);
    // throw error;
  }
};

export { getAlbumsNewReleases };