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
  textSize,
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
      <Text style={styles.Text(textColor, textSize)}>{btnText}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: (width, height) => ({
    width: width,
    height: height,
    backgroundColor: COLOR.btnBackgroundColor,
    padding: scale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  }),
  Text: (textColor, textSize) => ({
    color: COLOR.textPrimaryColor,
    fontSize: textSize,
    fontFamily: "regular",
    textAlign:"center"
  }),
});

export default ReuseBtn;
