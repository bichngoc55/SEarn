const getLikedAlbumList = async (accessToken, userId) => {
  try {
    const response = await fetch(
      `http://10.0.2.2:3005/auth/${userId}/getLikedAlbums`,
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
