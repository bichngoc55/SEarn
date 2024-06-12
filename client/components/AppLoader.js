import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject]}>
      <LottieView source={require("../assets/loading.json")} autoPlay loop />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.3)",
    zIndex: 5,
  },
});

export default AppLoader;
