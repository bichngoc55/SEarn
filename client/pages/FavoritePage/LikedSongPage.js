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
import { getLikedSongList } from "../../service/getLikedSongList";
import SongItem from "../../components/songItem";

const LikedSongPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const accessToken = useSelector((state) => state.user.accessToken);
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  // useEffect(() => {
  //   if (accessTokenForSpotify) {
  //     //console.log("Access Token in useEffect:", accessTokenForSpotify);
  //   }
  // }, [user, accessTokenForSpotify]);
  const [songList, setSongList] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  
  //get song's in4 from Spotify
  useEffect(() => {
    const fetchTracks = async () => {
      // dispatch(fetchSpotifyAccessToken());
      try {
        const trackPromises = songList.map((songId) =>
          getTrack(accessTokenForSpotify, songId)
        );
        const trackData = await Promise.all(trackPromises);
        trackData.forEach((track) => {});
        setTracks(trackData);
      } catch (error) {}
    };

    fetchTracks();
  }, [songList, accessTokenForSpotify]);

  const navigation = useNavigation();

  //add like song to db
  const addToLikedSongs = async (songId) => {
    fetch(`http://localhost:3005/auth/${user._id}/addLikedSongs`, {
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
    fetch(`http://localhost:3005/auth/${user._id}/unlikeSongs`, {
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
  const handleLikeUnlike = async (songId) => {
    if (songList.includes(songId)) {
      await unlikeSong(songId);
      setSongList(songList.filter((id) => id !== songId));
    } else {
      await addToLikedSongs(songId);
      setSongList([...songList, songId]);
    }
  };
  const filteredSearchs = tracks.filter((search) =>
    search.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
        <TextInput
          placeholder="Search your liked song"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {searchText ? (
        <FlatList
          key={1}
          data={filteredSearchs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <SongItem
                input={item}
                songList={filteredSearchs}
                onLikeUnlike={handleLikeUnlike}
                isLiked={songList.includes(item.id)}
              />
            );
          }}
          nestedScrollEnabled={true}
          style={[styles.flatlistContainer, { marginTop: "4%" }]}
          ListFooterComponent={<View style={{ height: scale(190) }} />}
        />
      ) : (
        <>
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
                return (
                  <SongItem
                    input={item}
                    songList={tracks}
                    onLikeUnlike={handleLikeUnlike}
                    isLiked={songList.includes(item.id)}
                  />
                );
              }}
              ListFooterComponent={<View style={{ height: scale(30) }} />}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1B",
    marginTop: scale(20)
  },
  scrollView: {
    flex: 1,
  },
  headerL: {
    marginHorizontal: "5.1%",
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
    marginLeft: "5.1%",
    marginRight: "5.1%",
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
    marginLeft: "5.1%",
    marginRight: "5.1%",
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
    fontFamily: "semiBold",
  },
  flatlistContainer: {
    marginLeft: "5.1%",
    marginRight: "5.1%",
    flex: 1,
    marginBottom: "25%",
  },
});
export default LikedSongPage;
