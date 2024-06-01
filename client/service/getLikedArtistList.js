const getLikedArtistList = async (accessToken, userId) => {

    try {
        const response = await fetch(
          `http://10.0.2.2:3005/auth/${userId}/getLikedArtists`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${accessToken}`,
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