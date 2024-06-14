import { useNavigation, useIsFocused } from "@react-navigation/native";
import BottomSheetModal, {
  useBottomSheetController,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import scale from "../../constant/responsive";
import AddPlaylistModal from "../addPlaylistModal";
import axios from "axios";
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
import Toast from "react-native-toast-message";

const AddtoPlaylist = ({ song, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItem] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [songs, setSongList] = useState([]);
  const [checkedItem, setCheckedItem] = useState([]);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    fetchPlaylist();
  };
  useEffect(() => {
    if (isFocused) {
      fetchPlaylist();
    }
  }, [isFocused]);

  const savePlaylist = async () => {
    items.map((item) => {
      const updatedItems = items.filter((item) => {
        return item.isCheck && item.songs.includes(song.id);
      });
      if (updatedItems.length > 0) {
        const labelsToShow = updatedItems.map((item) => item.label).join(", ");
        showToastPlaylist(labelsToShow);
      } else {
        if (item.isCheck) {
          updatePlaylist(item);
        }
      }
    });
  };

  const unSavePlaylist = async () => {
    items.map((item) => {
      const updatedItems = items.filter((item) => {
        return item.isCheck && !item.songs.includes(song.id);
      });
      if (updatedItems.length > 0) {
        const labelsToShow = updatedItems.map((item) => item.label).join(", ");
        showToastUnPlaylist(labelsToShow);
      } else {
        if (item.isCheck) {
          updateDeleteFromPlaylist(item);
        }
      }
    });
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Thêm thành công",
      text2: "Bài hát vào danh sách",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
      onHide: () => {
        onClose();
      },
    });
  };

  const showToastDelete = () => {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Xóa thành công",
      text2: "Đã xóa bài hát khỏi danh sách phát",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
      onHide: () => {
        onClose();
      },
    });
  };

  const showToastPlaylist = (value) => {
    Toast.show({
      type: "error",
      position: "top",
      text1: "Không thể thêm, bài hát đã có trong",
      text2: value,
      visibilityTime: 2000,
      textStyle: {
        numberOfLines: 3, // Hiển thị tối đa 3 dòng cho text2
      },
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
      onSwipeUpComplete: () => {
        Toast.hide(); // Tự động ẩn toast khi kéo lên
      },
    });
  };

  const showToastUnPlaylist = (value) => {
    Toast.show({
      type: "error",
      position: "top",
      text1: "Lỗi xóa, bài hát không có trong",
      text2: value,
      visibilityTime: 2000,
      textStyle: {
        numberOfLines: 3, // Hiển thị tối đa 3 dòng cho text2
      },
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
      onSwipeUpComplete: () => {
        Toast.hide(); // Tự động ẩn toast khi kéo lên
      },
    });
  };

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
          songs: filteredPlaylistshehe.songs,
          isCheck: false,
        })
      );
      setItem(newItem);
    } catch (error) {}
  };

  const updatePlaylist = async (playlist) => {
    try {
      if (accessToken) {
        console.log("co access token trong add to playlist");
        await axios.patch(
          `http://localhost:3005/playlists/${playlist.value}`,
          {
            songs: [...playlist.songs, song.id],
            songCount: songs.length,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        showToast();
      } else alert("Chưa có accessToken");
    } catch (error) {
      alert(error.message);
    }
  };

  const updateDeleteFromPlaylist = async (playlist) => {
    try {
      if (accessToken) {
        const updatedSongs = playlist.songs.filter(
          (songId) => songId !== song.id
        );
        await axios.patch(
          `http://localhost:3005/playlists/${playlist.value}`,
          {
            songs: updatedSongs,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        showToastDelete();
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

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.textSave1} onPress={() => unSavePlaylist()}>
            Unsave
          </Text>
          <Text style={styles.textSave} onPress={() => savePlaylist()}>
            Save
          </Text>
        </View>
      </View>
      <AddPlaylistModal visible={modalVisible} onClose={toggleModal} />
      <FlatList
        data={items}
        style={{ flex: 1, marginBottom: "15%" }}
        keyExtractor={(item) => item.value}
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
  textSave1: {
    fontSize: scale(13),
    color: "white",
    fontFamily: "semiBold",
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: scale(10),
    paddingVertical: "1%",
    borderRadius: 5,
    marginRight: "5%",
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
