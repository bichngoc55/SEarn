import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const reuseBtn = ({ onPress, btnText, textColor }) => {
  return (
    <TouchableOpacity
      style={styles.container(
        width,
        height,
        backgroundColor,
        borderWidth,
        borderColor
      )}
      onPress={onPress}
    >
      <Text style={styles.Text(textColor)}>{btnText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: (width, height, backgroundColor, borderWidth, borderColor) => ({
    width: width,
    height: height,
    backgroundColor: backgroundColor,
    borderWidth: borderWidth,
    borderColor: borderColor,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }),
});

export default reuseBtn;
