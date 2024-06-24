import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import scale from "../../constant/responsive";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from "react-native";
import {
  Feather,
  FontAwesome6,
  Entypo,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AudioService from "../../service/audioService";
import { ScrollView } from "react-native-gesture-handler";

const Upcoming = ({ onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state) => state.user);
  let service = new AudioService();
  const [image, setImage] = useState(null);
  const getCurrentSongIndex = (item) => {
    return service.currentPlaylist.findIndex((im) => im.id === item.id);
  };
  const PlaySong = (item) => {
    service.currentSong = item;
    service.loadSong();
    console.log(service.currentSong);
    service.currentTime = 0;
    service.currentAudioIndex = getCurrentSongIndex(item);
    service.playCurrentAudio();
    service.isGetCoin = true;
    onClose();
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.text}>Playing Playlist</Text>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        {service.currentPlaylist.map((item) => (
          <TouchableOpacity
            style={styles.trackContainer}
            key={item.id.toString()}
            onPress={() => PlaySong(item)}
          >
            {item.album && item.album.image ? (
              <Image source={{ uri: item.album.image }} style={styles.circle} />
            ) : (
              <Image
                source={{ uri: image }}
                // source={require("../assets/images/logoSEarn.png")}
                style={styles.circle}
              />
            )}
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
                {item.artists.map((artist) => artist.name).join(", ")}{" "}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    borderRadius: 50,
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
  modalView: {
    width: "100%",
    paddingBottom: "2%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#737373",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: scale(13),
    color: "white",
    fontFamily: "semiBold",
  },
  container: {},
  circle: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(60),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  textName: {
    fontFamily: "semiBold",
    color: "white",
    marginRight: scale(10),
    fontSize: scale(14),
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    fontFamily: "regular",
    marginRight: scale(10),
  },
  trackContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
});

export default Upcoming;
