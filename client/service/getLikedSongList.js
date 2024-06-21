const getLikedSongList = async (accessToken, userId) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3005/auth/${userId}/getLikedSongs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const likedSongs = await response.json();
      console.log("Đã gọi được liked Song List từ db");
      return {
        listLikedSongs: likedSongs.map((likedSong) => likedSong),
      };
    } catch (error) {
      console.error("Error get liked songs on db: ",error);
    }
  };
  
  export { getLikedSongList };