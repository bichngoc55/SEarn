import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLOR } from "../../constant/color";
import ReuseBtn from "../../components/buttonComponent";
//import { useNavigation } from "@react-navigation/native";
import scale from "../../constant/responsive";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../../redux/userSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessToken } = useSelector((state) => state.spotifyAccessToken);
  const handleSubmit = async () => {
    try {
      dispatch(logoutUser());

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("accessToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {user.accessToken}!</Text>
      <Text style={styles.text}>Hello, {accessToken}!</Text>
      <ReuseBtn
        onPress={handleSubmit}
        btnText="Log out"
        textColor="#ffffff"
        width={scale(210)}
        height={scale(65)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1B1B",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  text1: {
    fontSize: scale(26),
    fontFamily: "regular",
    position: "absolute",
    top: scale(300),
    fontWeight: "bold",
  },
  text2: {
    fontSize: scale(16),
    fontFamily: "light",
    position: "absolute",
    top: scale(350),
    textAlign: "center",
  },
  image: {
    width: "70%",
    position: "absolute",
    top: scale(100),
    height: scale(200),
    resizeMode: "contain",
  },
  stack: {
    position: "absolute",
    flex: 1,
    top: scale(420),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default UserPage;
