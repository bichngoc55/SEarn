import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLOR } from "../constant/color";
import scale from "../constant/responsive";

const TextField = ({
  placeholder,
  width,
  height,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <TextInput
      style={[
        styles.container(width, height, placeholder, isFocused),
        isFocused && styles.focusedInput,
      ]}
      placeholder={placeholder}
      placeholderTextColor="#6F6F6F"
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={value}
      onChangeText={onChangeText}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  container: (width, height, placeholder, isFocused) => ({
    width: width,
    height: height,
    backgroundColor: "transparent",
    borderColor: isFocused ? COLOR.textPrimaryColor : "#3C3B3B",
    borderWidth: 1,
    padding: scale(15),
    borderRadius: scale(15),
    marginBottom: scale(10),
    color: COLOR.textPrimaryColor,
  }),
  focusedInput: {},
});

export default TextField;
