import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import TextField from "../textField";
import ReuseBtn from "../buttonComponent";
import SuccessfulModal from "../successfulModal";
import BottomSheetModal, {
  useBottomSheetController,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
//import BottomSheet from "react-native-bottomsheet-reanimated";
import scale from "../../constant/responsive";
import { useSelector } from "react-redux";
// import * as Sharing from "expo-sharing";
// import Video from "react-native-video";
// //import RNFS from "react-native-fs";
// import * as FileSystem from "expo-file-system";
// import { Share } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  Feather,
  FontAwesome6,
  Entypo,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AddtoPlaylist from "./AddToPlaylist";
import Modal2 from "../modal";
import Upcoming from "./Upcoming";
import AudioService from "../../service/audioService";
import { getAlbum } from "../../service/albumService";

const MenuOfPlaysong = ({ visible, onClose, song }) => {
  const navigation = useNavigation();
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOpenUpcoming, setIsOpenUpcoming] = useState(false);
  const [report, setReport] = useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  let service = new AudioService();
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const snapPoints = ["25%", "50%"];
  const bottomSheetRef = useRef(null);
  const bottomUpcomingSheetRef = useRef(null);
  function presentModal() {
    bottomSheetRef.current?.expand();
    setShowOverlay(true);
    setIsOpen(true);
  }
  function presentUpcomingModal() {
    //bottomUpcomingSheetRef.current?.expand();
    console.log("Upcoming");
    setShowOverlay(true);
    setIsOpenUpcoming(true);
  }
  function presentUpcomingModal() {
    bottomUpcomingSheetRef.current?.expand();
    setIsOpenUpcoming(true);
  }
  function handleAddToPlaylistClose() {
    onClose();
  }
  function handleUpcomingClose() {
    setIsOpenUpcoming(false);
    setShowOverlay(false);
    onClose();
  }

  const getAlbumDetail = async (albumId) => {
    try {
      if (accessTokenForSpotify) {
        const albumData = await getAlbum(accessTokenForSpotify, albumId);
        return albumData;
      } else {
        alert("accessToken: " + accessTokenForSpotify);
      }
    } catch (error) {
      console.error("Error fetching album detail:", error);
    }
  };

  const moveToAlbum = async () => {
    if (service.currentSong?.album?.id) {
      const albumDetail = await getAlbumDetail(service.currentSong.album.id);
      console.log(albumDetail);
      if (albumDetail) {
        navigation.navigate("AlbumDetail", {
          album: albumDetail,
        });
      } else {
        alert("Error fetching album detail");
      }
    } else {
      alert("Album ID is undefined");
    }
  };
  const handleCloseBottomSheet = () => {
    onClose();
    setIsOpen(false);
    setShowOverlay(false);
  };

  const handleReport = () => {
    openReportModal();
  };
  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };
  const handleChange = (text) => {
    setReport(text);
  };
  const handleSendReport = async (report) => {
    closeReportModal();
    setReport("");
    setIsSuccessModalVisible(true);

    setTimeout(() => {
      setIsSuccessModalVisible(false);
    }, 4000);
  };
  const handleAddToPlaylist = () => {
    presentModal();
  };
  const handleUpcoming = () => {
    setShowOverlay(true);
    setIsOpenUpcoming(true);
  };

  const handleShare = async () => {
    try {
      const audioUrl = song.preview_url;
      const audioFileName = "audio.mp3";
      const audioFilePath = `${FileSystem.cacheDirectory}${audioFileName}`;

      await FileSystem.downloadAsync(audioUrl, audioFilePath);

      // Chia sẻ file âm thanh

      await Sharing.shareAsync(audioFilePath, {
        mimeType: "audio/mp3",
        dialogTitle: "Share Audio File",
        subject: song.name,
        url: song.name,
      });
    } catch (error) {
      console.log("Error sharing audio file:", error.message);
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {showOverlay ? <View style={styles.overlay} /> : null}
          {isOpenUpcoming ? (
            <BottomSheetModal
              ref={bottomUpcomingSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={handleUpcomingClose}
              handleIndicatorStyle={{ backgroundColor: "white" }}
              backgroundStyle={{
                borderRadius: 50,
                backgroundColor: "#1b1b1b",
              }}
            >
              <Upcoming onClose={() => handleUpcomingClose()} />
            </BottomSheetModal>
          ) : null}
          {/* {showOverlay ? <View style={styles.overlay} /> : null} */}
          {!isOpenUpcoming && !isOpen ? (
            <Modal
              visible={visible}
              animationType="slide"
              transparent={true}
              onRequestClose={onClose}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.headerX}>
                    <Text style={styles.text}>Song Menu</Text>
                    <Feather
                      name="x-circle"
                      size={24}
                      color="#FED215"
                      onPress={onClose}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.iconandtext}
                    onPress={handleAddToPlaylist}
                  >
                    <FontAwesome6 name="plus" size={24} color="white" />
                    <Text style={styles.textSmall}> Add To Playlist</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconandtext}
                    onPress={moveToAlbum}
                  >
                    <MaterialIcons name="album" size={24} color="white" />
                    <Text style={styles.textSmall}>Visit Album</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconandtext}
                    onPress={() => handleShare()}
                  >
                    <Entypo name="share" size={24} color="white" />
                    <Text style={styles.textSmall}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconandtext}
                    onPress={handleReport}
                  >
                    <Octicons name="report" size={24} color="white" />
                    <Text style={styles.textSmall}>Report</Text>
                    <Modal2
                      isOpen={isReportModalOpen}
                      onClose={closeReportModal}
                    >
                      <View style={styles.FeedbackContainer}>
                        <Text style={styles.feedbackText}>Report form</Text>
                        <TextField
                          placeholder="Enter your report"
                          width={scale(310)}
                          height={scale(65)}
                          onChangeText={handleChange}
                          value={report}
                        />
                        <View style={styles.btnContainer2}>
                          <ReuseBtn
                            width={scale(150)}
                            height={scale(60)}
                            btnText="Send Report"
                            onPress={() => handleSendReport(report)}
                          />
                          <TouchableOpacity
                            style={styles.btnClose}
                            onPress={closeReportModal}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: scale(18),
                                fontFamily: "regular",
                              }}
                            >
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal2>
                    <SuccessfulModal
                      text={"You have sent report successfully"}
                      isVisible={isSuccessModalVisible}
                      onClose={() => setIsSuccessModalVisible(false)}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconandtext}
                    onPress={handleUpcoming}
                  >
                    <Entypo name="list" size={24} color="white" />
                    <Text style={styles.textSmall}>Upcoming</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : null}
          {isOpen ? (
            <BottomSheetModal
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={handleCloseBottomSheet}
              handleIndicatorStyle={{ backgroundColor: "white" }}
              backgroundStyle={{
                borderRadius: 50,
                backgroundColor: "transparent",
              }}
            >
              <AddtoPlaylist
                song={song}
                onClose={() => handleAddToPlaylistClose()}
              />
            </BottomSheetModal>
          ) : null}
          {/* {isOpenUpcoming ? (
            <BottomSheetModal
              ref={bottomUpcomingSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={handleUpcomingClose}
              handleIndicatorStyle={{ backgroundColor: "white" }}
              backgroundStyle={{
                borderRadius: 50,
                backgroundColor: "#1b1b1b",
              }}
            >
              <Upcoming onClose={() => handleUpcomingClose()} />
            </BottomSheetModal>
          ) : null} */}
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#2b2b2b",
    borderRadius: 20,
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },

  headerX: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontFamily: "semiBold",
    color: "white",
    fontFamily: "semiBold",
    color: "#FED215",
  },
  iconandtext: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: "5%",
  },
  textSmall: {
    fontSize: scale(13),
    color: "white",
    fontFamily: "regular",
    marginLeft: scale(10),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  btnContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: scale(20),
    marginBottom: scale(20),
    alignItems: "center",
  },
  FeedbackContainer: {
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: scale(20),
  },
  feedbackText: {
    color: "white",
    fontSize: scale(20),
    fontFamily: "bold",
    marginTop: scale(20),
    marginBottom: scale(20),
    fontFamily: "regular",
    textAlign: "center",
  },
  btnClose: {
    width: scale(150),
    height: scale(60),
    marginLeft: scale(20),
    fontFamily: "regular",

    marginRight: scale(10),
    backgroundColor: "red",
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
  },
});

export default MenuOfPlaysong;
