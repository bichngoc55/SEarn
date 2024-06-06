const getLikedArtistList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `https://c17d-2405-4802-a632-dc60-9df3-e7d9-e18e-caf7.ngrok-free.app/auth/${userId}/getLikedArtists`,
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
