import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getTrack } from "../../service/songService";
import SongItem from "../../components/songItem";
import { useNavigation } from "@react-navigation/native";

const PlaylistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
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
      console.log("Access Token in useEffect:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);
  const [songList, setSongList] = useState([
    "3qhYidu0cemx1v9PgTtpS5",
    "6jcLKVmEKAQIXIVHJZ8vzS",
    "5iZHnufFUgATzrpGgH1K0W",
  ]);
  const [tracks, setTracks] = useState([]);

  // useEffect(() => {
  //   dispatch(fetchSpotifyAccessToken());
  // }, [dispatch]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        if (accessTokenForSpotify) {
          const trackPromises = songList.map((songId) =>
            getTrack(accessTokenForSpotify, songId)
          );
          const trackData = await Promise.all(trackPromises);
          trackData.forEach((track) => {});
          setTracks(trackData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, [accessTokenForSpotify, songList]);

  const navigation = useNavigation();

  const MoveToLikedSong = () => {
    navigation.navigate("LikedSong");
  };

  return (
    <SafeAreaView
      style={{
        marginHorizontal: 25,
        height: "100%",
      }}
    >
      <View style={styles.NewPlaylist}>
        <TouchableOpacity style={styles.container}>
          <View style={styles.circle}>
            <Feather name="plus" size={30} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>New playlist</Text>
      </View>

      <TouchableOpacity style={styles.NewPlaylist} onPress={MoveToLikedSong}>
        <TouchableOpacity style={styles.container}>
          <View style={styles.circle}>
            <Ionicons name="heart-outline" size={30} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Your liked song</Text>
      </TouchableOpacity>

      {/* <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <SongItem item={item} />;
        }}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 15,
    backgroundColor: "#49A078",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  NewPlaylist: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default PlaylistPage;
