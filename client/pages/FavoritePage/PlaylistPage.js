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
import * as utils from "../../service/songService";

const PlaylistPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.spotifyAccessToken.accessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);
  const [songList, setSongList] = useState([
    "3qhYidu0cemx1v9PgTtpS5",
    "6jcLKVmEKAQIXIVHJZ8vzS",
    "5iZHnufFUgATzrpGgH1K0W",
  ]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        if (accessToken) {
          const trackPromises = songList.map((songId) =>
            utils.getTrack(accessToken, songId)
          );
          const trackData = await Promise.all(trackPromises);
          trackData.forEach((track) => {});
          setTracks(trackData);
        } else alert("accessToken:" + accessToken);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, [accessToken, songList]);

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

      <View style={styles.NewPlaylist}>
        <TouchableOpacity style={styles.container}>
          <View style={styles.circle}>
            <Ionicons name="heart-outline" size={30} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Your liked song</Text>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            <Image
              source={{ uri: item.album.images[0].url }}
              style={styles.circle}
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>
                {item.artists.map((artist) => artist.name).join(", ")}
              </Text>
            </View>
          </View>
        )}
      />
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
