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
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getPlaylistTracks } from "../../service/getPlaylistTracks";
import { useSelector, useDispatch } from "react-redux";
import SongItem from "../../components/songItem";
import AppLoader from "../../components/AppLoader";
import LoaderService from "../../service/loaderService";
const PlaylistDetailScreen = ({ route }) => {
  const { playlist } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (accessTokenForSpotify) {
      //console.log("Access Token in useEffect playlist:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [likedSongList, setLikedSongList] = useState([]);

  // get liked song list on db
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
        setLikedSongList(likedSong);
      } catch (error) {
        alert("Error in likedsong: " + error);
      }
    };
    getLikedSong();
  }, [user?._id, accessToken]);

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getPlaylistTracks(
            accessTokenForSpotify,
            playlist.id
          );
          const playlistTracksPromises = [...items];
          const playlistTracksData = await Promise.all(playlistTracksPromises);
          playlistTracksData.forEach((playlistTrack) => {});
          setPlaylistTracks(playlistTracksData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching playlist tracks hehe:", error);
      }
    };
    fetchPlaylistTracks();
  }, [accessTokenForSpotify, playlist.id]);

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
    <SafeAreaView style={styles.Container}>
      <View style={styles.img_and_backBtn}>
        <Image
          source={{ uri: playlist.images[0].url }}
          style={styles.playlistImg}
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
      <Text style={styles.playlistName}>{playlist.name}</Text>

      <View style={styles.content}>
        <View style={styles.flatlistContainer}>
          <FlatList
            data={playlistTracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <SongItem input={item} songList={playlistTracks} 
              onLikeUnlike={handleLikeUnlikeSong}
              isLiked={likedSongList?.includes(item.id)}/>;
            }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
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
    height: scale(300),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  playlistImg: {
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
  playlistName: {
    marginTop: scale(15),
    color: COLOR.hightlightText,
    fontSize: 24,
    fontFamily: "bold",
    alignSelf: "center",
  },
  textTotal_tracks: {
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
    marginTop: scale(10),
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});

export default PlaylistDetailScreen;
