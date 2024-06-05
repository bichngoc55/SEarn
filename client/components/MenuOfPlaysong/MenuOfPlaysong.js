import React, { useState, useRef, useCallback, useMemo } from "react";

import BottomSheetModal, {
  useBottomSheetController,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
//import BottomSheet from "react-native-bottomsheet-reanimated";

import scale from "../../constant/responsive";
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
  Button,
} from "react-native";
import {
  Feather,
  FontAwesome6,
  Entypo,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AddtoPlaylist from "./AddToPlaylist";

const MenuOfPlaysong = ({ visible, onClose, song }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const snapPoints = ["25%", "50%"];
  const bottomSheetRef = useRef(null);
  function presentModal() {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
  }
  const handleCloseBottomSheet = () => {
    setIsOpen(false);
    console.log(isOpen);
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
                onPress={() => presentModal()}
              >
                <FontAwesome6 name="plus" size={24} color="white" />
                <Text style={styles.textSmall}> Add To Playlist</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconandtext}>
                <MaterialIcons name="album" size={24} color="white" />
                <Text style={styles.textSmall}>Visit Album</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconandtext}>
                <Entypo name="share" size={24} color="white" />
                <Text style={styles.textSmall}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconandtext}>
                <Octicons name="report" size={24} color="white" />
                <Text style={styles.textSmall}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isOpen ? (
            <BottomSheetModal
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              handleIndicatorStyle={{ backgroundColor: "white" }}
              backgroundStyle={{
                borderRadius: 50,
                backgroundColor: "transparent",
              }}
            >
              <AddtoPlaylist song={song} />
            </BottomSheetModal>
          ) : null}
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
    fontSize: scale(14),
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
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
});

export default MenuOfPlaysong;
