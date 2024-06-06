const getLikedAlbumList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `https://0452-2405-4802-a632-dc60-6480-d96f-a630-5850.ngrok-free.app/auth/${userId}/getLikedAlbums`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const likedAlbums = await response.json();
    console.log("Đã gọi được likedAlbumList từ db");
    return {
      listLikedAlbums: likedAlbums.map((likedAlbum) => ({
        id: likedAlbum.id,
        timeAdded: likedAlbum.timeAdded,
      })),
    };
  } catch (error) {
    console.error(error);
    console.log(accessToken);
  }
};

export { getLikedAlbumList };
