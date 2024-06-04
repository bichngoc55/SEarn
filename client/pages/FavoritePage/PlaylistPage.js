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
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import scale from "../../constant/responsive";
import AddPlaylistModal from "../../components/addPlaylistModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlaylistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const [playlists, setPlaylists] = useState([]);
  const isFocused = useIsFocused();
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    fetchPlaylist();
  };
  useEffect(() => {
    if (isFocused) {
      fetchPlaylist();
    }
  }, [isFocused, fetchPlaylist]);

  useEffect(() => {
    if (accessTokenForSpotify) {
      console.log("Access Token in useEffect:", accessTokenForSpotify);
    }
  }, [dispatch, user.id, accessTokenForSpotify]);

  const fetchPlaylist = async () => {
    try {
      const response = await fetch("http://localhost:3005/playlists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Lọc các playlist có userIdOwner khớp với userId được truyền vào
      const playlists = await response.json();
      let filteredPlaylistshehe = [];

      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].userIdOwner === user._id) {
          filteredPlaylistshehe.push(playlists[i]);
        }
      }
      setPlaylists(filteredPlaylistshehe);
    } catch (error) {}
  };

  const navigation = useNavigation();

  const MoveToLikedSong = () => {
    navigation.navigate("LikedSong");
  };

  return (
    <SafeAreaView
      style={{
        marginHorizontal: scale(20),
        height: "100%",
      }}
    >
      <GestureHandlerRootView style={styles.content}>
        <FlatList
          data={playlists}
          style={{ flex: 1, marginBottom: "15%" }}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <>
              <View style={styles.NewPlaylist}>
                <TouchableOpacity
                  style={styles.container}
                  onPress={toggleModal}
                >
                  <View style={styles.circle}>
                    <Feather name="plus" size={30} color="black" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>New playlist</Text>
              </View>

              <AddPlaylistModal visible={modalVisible} onClose={toggleModal} />

              <TouchableOpacity
                style={styles.LikedSong}
                onPress={MoveToLikedSong}
              >
                <TouchableOpacity style={styles.container}>
                  <View style={styles.circle}>
                    <Ionicons name="heart-outline" size={30} color="black" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>Your liked song</Text>
              </TouchableOpacity>
            </>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.playlistContainer}
                onPress={() => {
                  navigation.navigate("PlaylistDetailMongo", {
                    playlist: item,
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/default.png")}
                  style={styles.circlePlaylist}
                />
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <Text
                    style={styles.textName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={styles.textArtist}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>
                {item.privacyOrPublic ? (
                  <MaterialIcons name="public" size={30} color="#FED215" />
                ) : (
                  <MaterialIcons name="public-off" size={30} color="gray" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  circle: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(60),
    marginTop: 15,
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  NewPlaylist: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scale(5),
  },
  LikedSong: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(5),
    marginBottom: scale(25),
  },
  text: {
    fontSize: scale(15),
    color: "white",
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  playlistContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
  circlePlaylist: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(50),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  textName: {
    fontSize: scale(14),
    color: "white",
    marginRight: scale(10),
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    marginRight: scale(10),
  },
  content: {
    flex: 1,
  },
});

export default PlaylistPage;
