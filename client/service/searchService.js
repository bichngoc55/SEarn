import axios from "axios";

const getSearch = async (accessToken, searchText) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track,artist,album&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const searchList = response.data;
    return {
      tracks: searchList.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.album.images.map((image) => ({
          url: image.url,
          height: image.height,
          width: image.width,
        })),
        album: {
          id: item.album.id,
          name: item.album.name,
          image: item.album.images[0].url,
        },
        preview_url: item.preview_url,
        type: "track",
      })),
      artists: searchList.artists.items.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.images.map((image) => ({
          url: image.url,
          height: image.height,
          width: image.width,
        })),
        genres: item.genres.map((genre) => ({
          typeGenre: genre,
        })),
        type: "artist",
      })),
      albums: searchList.albums.items.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.images.map((image) => ({
          url: image.url,
          height: image.height,
          width: image.width,
        })),
        type: "album",
      })),
    };
  } catch (error) {
    console.error("Error fetching Search for Item:", error);
    throw error;
  }
};

export { getSearch };
