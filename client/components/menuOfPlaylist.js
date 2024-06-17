import React, { useState } from "react";
import scale from "../constant/responsive";
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
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import EditPlaylistModal from "./editPlaylistModal";
import AddPlaylistModal from "./addPlaylistModal";
import DeletePlaylistModal from "./deletePlaylist";

const MenuOfPlaylist = ({ visible, onClose, playlist }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const toggleModalAdd = () => {
    setModalAddVisible(!modalAddVisible);
  };
  const toggleModalDelete = () => {
    setModalDeleteVisible(!modalDeleteVisible);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerX}>
            <Text style={styles.text}>Menu Of Playlist</Text>
            <Feather
              name="x-circle"
              size={24}
              color="#FED215"
              onPress={onClose}
            />
          </View>

          <TouchableOpacity style={styles.iconandtext} onPress={toggleModalAdd}>
            <FontAwesome6 name="plus" size={24} color="white" />
            <Text style={styles.textSmall}> Add New Playlist</Text>
          </TouchableOpacity>

          <AddPlaylistModal
            visible={modalAddVisible}
            onClose={toggleModalAdd}
          />

          <TouchableOpacity style={styles.iconandtext} onPress={toggleModal}>
            <FontAwesome name="edit" size={24} color="white" />
            <Text style={styles.textSmall}>Edit Playlist</Text>
          </TouchableOpacity>

          <EditPlaylistModal
            visible={modalVisible}
            onClose={toggleModal}
            playlist={playlist}
          />

          <TouchableOpacity
            style={styles.iconandtext}
            onPress={toggleModalDelete}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.textSmall}>Delete Playlist</Text>
          </TouchableOpacity>

          <DeletePlaylistModal
            visible={modalDeleteVisible}
            onClose={toggleModalDelete}
            playlist={playlist}
          />
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
});

export default MenuOfPlaylist;
