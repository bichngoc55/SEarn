import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import scale from "../constant/responsive";

const SuccessfulModal = ({ text, isVisible, onClose }) => {
  useEffect(() => {
    let timer;

    if (isVisible) {
      timer = setTimeout(() => {
        onClose();
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <AntDesign name="check" size={24} color="green" />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    backgroundColor: "black",
    borderRadius: scale(15),

    alignItems: "center",
    flexDirection: "row",
    width: scale(300),
  },
  text: {
    fontSize: scale(15),
    marginTop: 10,
    marginLeft: scale(10),
    color: "white",
    marginVertical: scale(10),
  },
};

export default SuccessfulModal;
