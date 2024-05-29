import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import scale from "../../constant/responsive";
import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTrack } from "../../service/songService";
import { FontAwesome } from "@expo/vector-icons";
import SongItem from "../../components/songItem";

const LikedSongPage = () => {
  const dispatch = useDispatch();
  const accessToken =
    "BQBqgPKB92oVIBbnCkdn_ptGLCoFEfOkhYZqXhdJGJRqmlIYHbcaH51Tz0nt0oUEhojjnxxyym1FPfXo_8GZVUmKgoL7DPesUtA02vWGHBWUUg6FLiI";
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);
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
        if (accessToken) {
          const trackPromises = songList.map((songId) =>
            getTrack(accessToken, songId)
          );
          const trackData = await Promise.all(trackPromises);
          trackData.forEach((track) => {});
          setTracks(trackData);
        } else alert("accessToken:" + accessToken);
      } catch (error) {
        
      }
    };

    fetchTracks();
  }, [accessToken, songList]);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerL}>
        <Ionicons
          name="arrow-back-circle"
          size={scale(30)}
          color="#737373"
          onPress={navigation.goBack}
        />
        <Text style={styles.headerText}>Your liked song</Text>
        <View style={{ width: scale(30), height: scale(30) }} />
      </View>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search-outline"
          size={24}
          style={styles.iconSearch}
          color="#737373"
        />
        <TextInput placeholder="Search your liked song" />
      </View>
      <View style={styles.funcContainer}>
        <View style={styles.func}>
          <Text style={styles.text}>{tracks.length} songs</Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="arrow-up-down"
              size={24}
              color="black"
            />
          </View>
          <Text style={styles.text}>Default</Text>
        </View>
        <FontAwesome name="play-circle" size={scale(50)} color="#FED215" />
      </View>

      <View style={styles.flatlistContainer}>
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            console.log("Item:", item);
            return <SongItem input={item} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  scrollView: {
    flex: 1,
  },
  headerL: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    height: scale(35),
    alignItems: "center",
    marginTop: "2.68%",
    marginBottom: "4.68%",
    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
  },
  searchBarContainer: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    backgroundColor: "#D9D9D9",
    height: scale(40),
    borderRadius: scale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  iconSearch: {
    marginHorizontal: "2.48%",
  },
  func: {
    alignItems: "center",
    flexDirection: "row",
  },
  funcContainer: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "6.48%",
    marginBottom: "2.48%",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(10),
  },
  text: {
    color: "#FFFFFF",
    fontSize: scale(14),
  },
  flatlistContainer: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
  },
});
export default LikedSongPage;
