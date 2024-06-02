import React, { useState, useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import scale from "../../constant/responsive";
const AppLoader = () => {
  return (
    <View style={[]}>
      <LottieView source={require("../assets/loading.json")} autoPlay loop />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});
