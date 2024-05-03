import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLOR } from "../constant/color";

const ReuseBtn = ({
  onPress,
  btnText,
  textColor,
  width,
  height,
  borderColor,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const handleHoverIn = () => {
    setIsHovered(true);
  };

  const handleHoverOut = () => {
    setIsHovered(false);
  };

  const buttonBackgroundColor = isSelected
    ? COLOR.btnBackgroundColor // If selected, use the background color
    : isHovered
    ? COLOR.btnBackgroundColor // If hovered and not selected, use the background color
    : "transparent";
  return (
    <TouchableOpacity
      style={[
        styles.container(width, height, borderColor),
        { backgroundColor: buttonBackgroundColor },
      ]}
      onPress={onPress}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <Text style={styles.Text(textColor)}>{btnText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: (width, height, borderColor) => ({
    width: width,
    height: height,
    backgroundColor: COLOR.btnBackgroundColor,
    borderWidth: 1,
    borderColor: borderColor,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }),
  Text: (textColor) => ({
    color: textColor,
    fontFamily: "regular",
    fontSize: 18,
    fontWeight: "bold",
  }),
});

export default ReuseBtn;
