import React, { useState } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import scale from "../constant/responsive";
import axios from "axios";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const DeletePlaylistModal = ({ visible, onClose, playlist }) => {
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);

  const DeletePlaylist = async () => {
    try {
      if (accessToken) {
        await axios.delete(
          `https://3268-1-53-10-45.ngrok-free.app/playlists/${playlist._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("Xóa thành công");
        onClose();
      } else alert("Chưa có accessToken");
    } catch (error) {
      alert(error.message);
    }
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
            <Text style={styles.modalText}>Delete This Playlist</Text>
            <Text
              style={{
                fontSize: scale(12),
                color: "white",
                fontWeight: "300",
                alignItems: "center",
                marginTop: "3%",
              }}
            >
              Note: This action can not undo
            </Text>
          </View>

          <View style={styles.cancelandsave}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                DeletePlaylist();
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </View>
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
    width: "70%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#FED215",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: scale(15),
    color: "white",
  },
  cancelandsave: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
    width: "100%",
    paddingHorizontal: "5%",
  },
  headerX: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  label: {
    marginRight: scale(10),
    fontSize: scale(11),
    color: "white",
    fontWeight: "500",
    marginBottom: scale(5),
  },
  input: {
    width: "100%",
    paddingLeft: scale(10),
    paddingVertical: scale(7),
    borderRadius: scale(10),
    fontSize: scale(11),
    backgroundColor: "#D9D9D9",
  },
  cardBigContainer: {
    marginBottom: scale(15),
  },
});

export default DeletePlaylistModal;
