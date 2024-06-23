import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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

import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import Ionicons from "react-native-vector-icons/Ionicons";
import ArtistAlbumItem from "../../components/artistAlbumItem";
import SongItem from "../../components/songItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getArtistAlbum } from "../../service/artistAlbumsService";
import { getArtistSong } from "../../service/artistSongService";
import { getLikedAlbumList } from "../../service/getLikedAlbumList";

import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ArtistDetailScreen = ({ route }) => {
  const { artist } = route.params;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  // useEffect(() => {
  //   dispatch(fetchSpotifyAccessToken());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (accessTokenForSpotify) {
  //     //console.log("Access Token in useEffect artist:", accessTokenForSpotify);
  //   }
  // }, [user, accessTokenForSpotify]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [likedAlbumList, setLikedAlbumList] = useState([]);
  const [songList, setSongList] = useState([]);

  //get liked album list on db
  useEffect(() => {
    const fetchLikedAlbumList = async () => {
      try {
        if (accessToken) {
          const { listLikedAlbums } = await getLikedAlbumList(
            accessToken,
            user._id
          );
          const albumIds = listLikedAlbums.map((likedAlbum) => likedAlbum.id);
          setLikedAlbumList(albumIds);
        } else alert("Chưa có accessToken");
      } catch (error) {
        console.error("Error fetching liked albums:", error);
      }
    };
    fetchLikedAlbumList();
  }, [user?._id, accessToken]);

  //get liked song from db
  useEffect(() => {
    const getLikedSong = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:3005/auth/${user._id}/getLikedSongs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const likedSong = await response.json();
        setSongList(likedSong);
      } catch (error) {
        alert("Error in likedsong: " + error);
      }
    };
    getLikedSong();
  }, [user?._id, accessToken]);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getArtistAlbum(
            accessTokenForSpotify,
            artist.id
          );
          const artistAlbumsPromises = [...items];
          const artistAlbumData = await Promise.all(artistAlbumsPromises);
          artistAlbumData.forEach((artistAlbum) => {});
          setArtistAlbums(artistAlbumData);

          const { tracks } = await getArtistSong(
            accessTokenForSpotify,
            artist.id
          );
          const artistSongsPromises = [...tracks];
          const artistSongData = await Promise.all(artistSongsPromises);
          artistSongData.forEach((artistSong) => {});
          setArtistSongs(artistSongData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching artists album hehe:", error);
      }
    };
    fetchArtistAlbums();
  }, [accessTokenForSpotify, artist.id]);

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
  // Handle like/unlike album action
  const handleLikeUnlikeAlbum = async (albumId) => {
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
    if (songList.includes(songId)) {
      await unlikeSong(songId);
      setSongList(songList.filter((id) => id !== songId));
    } else {
      await addToLikedSongs(songId);
      setSongList([...songList, songId]);
    }
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.img_and_backBtn}>
        <Image
          source={{ uri: artist.images[0].url }}
          style={styles.artistImg}
          resizeMode="cover"
        />
        <View style={styles.backButtonContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <Text style={styles.artistName}>{artist.name}</Text>
      <Text style={styles.textGenre}>
        Genres {artist.genres.map((genre) => genre.typeGenre).join(", ")}{" "}
      </Text>

      <GestureHandlerRootView style={styles.content}>
        <FlatList
          style={styles.flatlistContainer}
          data={artistSongs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Albums</Text>
              <View style={styles.flatlistContainer}>
                <FlatList
                  horizontal={true}
                  data={artistAlbums}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <ArtistAlbumItem
                        input={item}
                        onLikeUnlike={handleLikeUnlikeAlbum}
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
                songList={artistSongs}
                onLikeUnlike={handleLikeUnlikeSong}
                isLiked={songList.includes(item.id)}
              />
            );
          }}
          nestedScrollEnabled={true}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingBottom: scale(60),
  },
  img_and_backBtn: {
    width: "100%",
    height: scale(250),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  artistImg: {
    position: "absolute",
    width: "100%",
    aspectRatio: 1,
  },
  backButtonContainer: {
    marginTop: scale(25),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(100),
    backgroundColor: "rgba(211, 211, 211, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  artistName: {
    marginTop: scale(15),
    color: COLOR.hightlightText,
    fontSize: 24,
    fontFamily: "bold",
    alignSelf: "center",
  },
  textGenre: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
    fontFamily: "regular",
    marginVertical: scale(5),
    textAlign: "center",
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

export default ArtistDetailScreen;
