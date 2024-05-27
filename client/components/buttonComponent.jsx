import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { COLOR } from "../constant/color";
import scale from "../constant/responsive";

const ReuseBtn = ({
  onPress,
  btnText,
  textColor,
  width,
  height,
  isSelected = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.container(width, height),
        { backgroundColor: isPressed ? COLOR.btnBackgroundColor : "#F4BC48" },
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)} // When pressed
      onPressOut={() => setIsPressed(false)} // When released
    >
      <Text style={styles.Text(textColor)}>{btnText}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: (width, height) => ({
    width: width,
    height: height,
    backgroundColor: COLOR.btnBackgroundColor,
    padding: scale(10),
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
  }),
  Text: (textColor) => ({
    color: COLOR.textPrimaryColor,
    fontFamily: "Montserrat",
    fontSize: scale(18),
  }),
});

export default ReuseBtn;
