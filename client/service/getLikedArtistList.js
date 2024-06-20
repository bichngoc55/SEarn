const getLikedArtistList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `https://bf40-2405-4802-a39b-a4d0-b040-fdd4-ec8a-4ef.ngrok-free.app/auth/${userId}/getLikedArtists`,
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
