import axios from "axios";

const getTracksRecommendations = async (accessToken) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/37i9dQZF1DX5G3iiHaIzdf/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const tracksRecommendations = await response.data;
    for (let item of tracksRecommendations.tracks.items) {
      const track = item.track;
    return {
    //   items: tracksRecommendations.items.map((item) => ({
    //     id: item.track.id,
    //     name: item.track.name,
    //     artists: item.track.artists.map((artist) => ({
    //       name: artist.name,
    //       id: artist.id,
    //     })),
    //     album: {
    //       id: item.track.album.id,
    //       name: item.track.album.name,
    //       image: item.track.album.images[0].url,
    //       },
    //   })),
    // };
      items: tracksRecommendations.items.map((item) => ({
        track:{
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
          })),
          album: {
            id: item.track.album.id,
            name: item.track.album.name,
            image: item.track.album.images[0].url,
          },
        }
      })),
    };
  }
  } catch (error) {
    console.error("Error fetching artist's album:", error);
    throw error;
  }
};

export { getTracksRecommendations };
