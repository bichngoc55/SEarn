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

const EditPlaylistModal = ({ visible, onClose, playlist }) => {
  const [isPublic, setIsPublic] = useState(playlist.privacyOrPublic);
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const toggleSwitch = () => setIsPublic((previousState) => !previousState);

  const updatePlaylist = async () => {
    try {
      if (accessToken) {
        await axios.patch(
          `https://c17d-2405-4802-a632-dc60-9df3-e7d9-e18e-caf7.ngrok-free.app/playlists/${playlist._id}`,
          {
            name,
            description,
            privacyOrPublic: isPublic,
          },
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
            <Text style={styles.modalText}>Add New Playlist</Text>
            <Feather
              name="x-circle"
              size={24}
              color="white"
              onPress={onClose}
            />
          </View>
          <Text
            style={{
              fontSize: scale(11),
              color: "white",
              fontWeight: "300",
              marginBottom: scale(20),
            }}
          >
            Fill information below to add playlist
          </Text>

          <View style={styles.cardBigContainer}>
            <Text style={styles.label}>Playlist Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Playlist Name"
              keyboardType="default"
            />
          </View>

          <View style={styles.cardBigContainer}>
            <Text style={styles.label}>Playlist Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Playlist Description"
              keyboardType="default"
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Public This Playlist?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FED215" }}
              thumbColor={"#f4f3f4"}
              style={{ width: "100%" }}
              onValueChange={toggleSwitch}
              value={isPublic}
            />
          </View>

          <View style={styles.cancelandsave}>
            <View style={{ flex: 1 }}></View>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                updatePlaylist();
              }}
            >
              <Text
                style={styles.textStyle}
                // onPress={() => {
                //   CreateNewPlaylist();
                // }}
              >
                Save
              </Text>
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
    width: "80%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#FED215",
    marginLeft: "5%",
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
    marginTop: "10%",
    width: "100%",
  },
  headerX: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: scale(5),
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

export default EditPlaylistModal;
