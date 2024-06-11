const getLikedArtistList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `https://b3bd-183-80-111-110.ngrok-free.app/auth/${userId}/getLikedArtists`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const likedArtists = await response.json();
    console.log("Đã gọi được liked Artist List từ db");
    return {
      listLikedArtists: likedArtists.map((likedArtist) => ({
        id: likedArtist.id,
        timeAdded: likedArtist.timeAdded,
      })),
    };
  } catch (error) {
    console.error(error);
    console.log(accessToken);
  }
};

export { getLikedArtistList };
