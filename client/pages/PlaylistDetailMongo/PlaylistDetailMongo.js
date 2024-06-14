import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
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
import { Entypo } from "@expo/vector-icons";
import { getTrack } from "../../service/songService";
import SongItem from "../../components/songItem";
import MenuOfPlaylist from "../../components/menuOfPlaylist";

const PlaylistDetailMongo = ({ route }) => {
  const { playlist } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isFocused = useIsFocused();
  const [tracks, setTracks] = useState([]);
  const [isPublic, setIsPublic] = useState(playlist.privacyOrPublic);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const songList = playlist.songs;
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    getPlaylistDetails();
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackPromises = playlist.songs.map((songId) =>
          getTrack(accessTokenForSpotify, songId)
        );
        const trackData = await Promise.all(trackPromises);
        trackData.forEach((track) => {});
        setTracks(trackData);
      } catch (error) {}
    };
    if (isFocused) {
      console.log("playlist is focused");
      getPlaylistDetails();
      fetchTracks();
    }
    getPlaylistDetails();
    fetchTracks();
  }, [isFocused]);

  const getPlaylistDetails = async () => {
    try {
      if (accessToken) {
        const response = await fetch(
          `https://97a3-113-22-232-171.ngrok-free.app/playlists/${playlist._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const playlistDetail = await response.json();
        console.log("cap nhat lai playlist", playlistDetail);
        setName(playlistDetail.name);
        setDescription(playlistDetail.description);
        setIsPublic(playlistDetail.privacyOrPublic);
      } else alert("Chưa có accessToken");
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.img_and_backBtn}>
        <Image
          source={{
            uri: "https://i.scdn.co/image/ab67616d0000b273212f0300aefcb79b00d2a6cf",
          }}
          style={styles.albumImg}
          resizeMode="cover"
        />
        <View style={styles.iconHeader}>
          <View style={styles.backButtonContainer}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back-sharp" size={24} color="black" />
            </Pressable>
          </View>
          <Pressable style={styles.backButton} onPress={toggleModal}>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </Pressable>
          <MenuOfPlaylist
            visible={modalVisible}
            onClose={toggleModal}
            playlist={playlist}
          />
        </View>
      </View>

      <View
        style={{ width: "100%", alignItems: "center", marginVertical: "4%" }}
      >
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textDes}>{description}</Text>
        <View style={styles.follow_and_song}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textName}>{playlist.songs.length}</Text>
            <Text style={styles.textDes}>Songs</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            {isPublic ? (
              <MaterialIcons name="public" size={26} color="white" />
            ) : (
              <MaterialIcons name="public-off" size={26} color="white" />
            )}
            <Text style={styles.textDes}>Status</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textName}>{playlist.numberOfLikes}</Text>
            <Text style={styles.textDes}>Likes</Text>
          </View>
        </View>
      </View>

      {/* hehe */}

      <View style={styles.flatlistContainer}>
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <SongItem input={item} songList={tracks} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1B",
  },
  img_and_backBtn: {
    width: "100%",
    height: scale(200),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  albumImg: {
    position: "absolute",
    width: "100%",
    aspectRatio: 1,
  },
  backButtonContainer: {},
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: 35,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  iconHeader: {
    marginTop: scale(25),
    marginHorizontal: scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textName: {
    fontSize: scale(16),
    color: "white",
  },
  textDes: {
    fontSize: scale(13),
    fontWeight: "300",
    color: "white",
  },
  follow_and_song: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    marginTop: "4%",
  },
  flatlistContainer: {
    flex: 1,
    marginHorizontal: "6.5%",
    marginBottom: "10%",
  },
});
export default PlaylistDetailMongo;
