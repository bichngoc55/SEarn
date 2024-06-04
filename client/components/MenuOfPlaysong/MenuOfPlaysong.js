import React, { useState } from "react";
import scale from "../../constant/responsive";
import {
  Modal,
  StyleSheet,
  View,
  Text,
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

const MenuOfPlaysong = ({ visible, onClose, song }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
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

          <TouchableOpacity style={styles.iconandtext}>
            <FontAwesome6 name="plus" size={24} color="white" />
            <Text style={styles.textSmall}> Add To Playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconandtext} onPress={toggleModal}>
            <MaterialIcons name="album" size={24} color="white" />
            <Text style={styles.textSmall}>Visit Album</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconandtext}>
            <Entypo name="share" size={24} color="black" />
            <Text style={styles.textSmall}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconandtext}>
            <Octicons name="report" size={24} color="white" />
            <Text style={styles.textSmall}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default MenuOfPlaysong;
