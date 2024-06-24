import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { useSelector, useDispatch } from "react-redux";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbumsNewReleases } from "../../service/albumsNewReleases";
import { getTracksRecommendations } from "../../service/songsRecommendations";
import { getLikedAlbumList } from "../../service/getLikedAlbumList";
import ArtistAlbumItem from "../../components/artistAlbumItem";
import SongItem from "../../components/songItem";

export default function NewsTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  // useEffect(() => {
  //   const { accessToken, expires_in } = dispatch(fetchSpotifyAccessToken());
  //   // console.log(
  //   //   "new access token for spotify in new tab screen: " + accessToken
  //   // );
  // }, [dispatch]);

  const [albumsNewReleases, setAlbumsNewReleases] = useState([]);
  const [tracksRecommendations, setTracksRecommendations] = useState([]);
  const [likedAlbumList, setLikedAlbumList] = useState([]);
  const [likedSongList, setLikedSongList] = useState([]);

  // get liked album list on db
  useEffect(() => {
    const getAlbumList = async () => {
      try {
        if (accessToken) {
          const { listLikedAlbums } = await getLikedAlbumList(
            accessToken,
            user?._id
          );
          const albumIds = listLikedAlbums.map((likedAlbum) => likedAlbum.id);
          setLikedAlbumList(albumIds);
        } 
        // else alert("Chưa có accessToken");
      } catch (error) {
        console.error("Error fetching liked albums in NewsTab:", error);
      }
    };

    getAlbumList();
  }, [user?._id, accessToken]);

  useEffect(() => {
    const getLikedSong = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:3005/auth/${user?._id}/getLikedSongs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.statusCode === 200) {
          const likedSong = await response.json();
          setLikedSongList(likedSong);
        }
      } catch (error) {
        alert("Error in likedsong: " + error);
      }
    };
    getLikedSong();
  }, [user?._id, accessToken]);

  useEffect(() => {
    const fetchAlbumsNewReleases = async () => {
      try {
        if (accessTokenForSpotify) {
          const { items } = await getAlbumsNewReleases(accessTokenForSpotify);
          const albumsPromises = [...items];
          const newAlbumsData = await Promise.all(albumsPromises);
          setAlbumsNewReleases(newAlbumsData);

          const { items: trackItems } = await getTracksRecommendations(
            accessTokenForSpotify
          );
          const tracksPromises = trackItems.map((item) => item.track);
          const tracksData = await Promise.all(tracksPromises);
          setTracksRecommendations(tracksData);
        } else {
          // alert("accessToken:" + accessTokenForSpotify);
        }
      } catch (error) {
        console.error("Error fetching tracks recommendations hehe:", error);
      }
    };
    fetchAlbumsNewReleases();
  }, [accessTokenForSpotify]);

  //add like album to db
  const addToLikedAlbums = async (albumId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/addLikedAlbums`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ albumId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike album on db
  const unlikeAlbum = async (albumId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/unlikeAlbum`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ albumId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  // Handle like/unlike action
  const handleLikeUnlikeAlbums = async (albumId) => {
    if (likedAlbumList.includes(albumId)) {
      await unlikeAlbum(albumId);
      setLikedAlbumList(likedAlbumList.filter((id) => id !== albumId));
    } else {
      await addToLikedAlbums(albumId);
      setLikedAlbumList([...likedAlbumList, albumId]);
    }
  };

  //add like song to db
  const addToLikedSongs = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/addLikedSongs`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike song on db
  const unlikeSong = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/unlikeSongs`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  // Handle like/unlike action
  const handleLikeUnlikeSong = async (songId) => {
    if (likedSongList?.includes(songId)) {
      await unlikeSong(songId);
      setLikedSongList(likedSongList.filter((id) => id !== songId));
    } else {
      await addToLikedSongs(songId);
      setLikedSongList([...likedSongList, songId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.content}>
        <FlatList
          style={styles.flatlistContainer}
          data={tracksRecommendations}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Albums</Text>
              <View style={styles.flatlistContainer}>
                <FlatList
                  horizontal={true}
                  data={albumsNewReleases}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <ArtistAlbumItem
                        input={item}
                        onLikeUnlike={handleLikeUnlikeAlbums}
                        isLiked={likedAlbumList.includes(item.id)}
                      />
                    );
                  }}
                  nestedScrollEnabled={true}
                />
              </View>
              <Text style={styles.title}>Top Songs</Text>
            </>
          }
          renderItem={({ item }) => {
            return (
              <SongItem
                input={item}
                songList={tracksRecommendations}
                onLikeUnlike={handleLikeUnlikeSong}
                isLiked={likedSongList?.includes(item.id)}
              />
            );
          }}
          nestedScrollEnabled={true}
          ListFooterComponent={<View style={{ height: scale(60) }} />}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  content: {
    marginHorizontal: scale(10),
    flex: 1,
  },
  title: {
    marginVertical: scale(10),
    color: "white",
    fontSize: 20,
    fontFamily: "bold",
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});
