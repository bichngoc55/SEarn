const getLikedArtistList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `https://c432-2405-4802-a632-dc60-bdf2-dcb0-6216-5931.ngrok-free.app/auth/${userId}/getLikedArtists`,
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
