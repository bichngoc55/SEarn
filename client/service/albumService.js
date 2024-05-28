import axios from "axios";

const getAlbum = async (accessToken, albumId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const album = response.data;
    console.log(album);
    return {
      name: album.name,
      id: album.id,
      artists: album.artists.map((artist) => ({
        name: artist.name,
        id: artist.id,
      })),
      tracks:album.tracks.items.map((track)  => ({
        name: track.name,
        id: track.id,
        artists: track.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
      })),
      images: album.images.map((image) => ({
        url: image.url,
        height: image.height,
        width: image.width,
      })),
        // album: {
        //   //id: track.album.id,
        //   name: track.album.name,
        //   image: track.album.images[0].url,
        // },
        // preview_url: track.preview_url,


    };
  } catch (error) {
    console.error("Error fetching track:", error);
    throw error;
  }
};

export { getAlbum };
