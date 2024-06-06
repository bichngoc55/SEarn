import { useNavigation, useIsFocused } from "@react-navigation/native";
import BottomSheetModal, {
  useBottomSheetController,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import scale from "../../constant/responsive";
import AddPlaylistModal from "../addPlaylistModal";
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
import Checkbox from "expo-checkbox";

const AddtoPlaylist = ({ song }) => {
  const [playlists, setPlaylists] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItem] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [songList, setSongList] = useState([]);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    fetchPlaylist();
  };
  useEffect(() => {
    if (isFocused) {
      fetchPlaylist();
    }
  }, [isFocused]);
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
      const newItem = filteredPlaylistshehe.map(
        (filteredPlaylistshehe, index) => ({
          label: filteredPlaylistshehe.name,
          value: filteredPlaylistshehe._id,
          isCheck: false,
        })
      );
      setItem(newItem);
    } catch (error) {}
  };

  const getLikedSong = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/auth/${user._id}/getLikedSongs`,
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

  const updatePlaylist = async (playlist) => {
    try {
      if (accessToken) {
        await axios.patch(
          `http://localhost:3005/playlists/${playlist._id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        onClose();
      } else alert("Chưa có accessToken");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckboxChange = (item) => {};

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.text}>Save To</Text>
      </View>
      <View style={styles.NewPlaylist}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => toggleModal()}
        >
          <View style={styles.circle}>
            <Feather name="plus" size={20} color="black" />
          </View>
          <Text style={styles.text}>New playlist</Text>
        </TouchableOpacity>

        <Text style={styles.textSave}>Save</Text>
      </View>
      <AddPlaylistModal visible={modalVisible} onClose={toggleModal} />
      <FlatList
        data={items}
        style={{ flex: 1, marginBottom: "15%" }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <View style={styles.playlistContainer}>
              <Image
                source={require("../../assets/images/default.png")}
                style={styles.circlePlaylist}
              />
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text
                  style={styles.textRegular}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              </View>
              <Checkbox
                value={item.isCheck}
                style={{ borderRadius: "10%" }}
                color={item.isCheck ? "#FED215" : "#737373"}
                onValueChange={(newValue) => {
                  const updatedItems = items.map((itemInArray) => {
                    if (itemInArray.value === item.value) {
                      return {
                        ...itemInArray,
                        isCheck: newValue,
                      };
                    }
                    return itemInArray;
                  });

                  setItem(updatedItems);
                }}
              />
            </View>
          );
        }}
      />
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
  textSave: {
    fontSize: scale(13),
    color: "white",
    fontFamily: "semiBold",
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: scale(10),
    paddingVertical: "1%",
    borderRadius: 5,
  },
  NewPlaylist: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "4%",
    justifyContent: "space-between",
  },
  circle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "5%",
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
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  textRegular: {
    fontFamily: "regular",
    fontSize: scale(13),
    color: "white",
    marginRight: scale(10),
  },
  content: {
    flex: 1,
  },
});

export default AddtoPlaylist;
