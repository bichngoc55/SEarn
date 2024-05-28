import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ExploreScreen() {
  
  return (
    <SafeAreaView
      style={{
        marginHorizontal: 25,
        height: "100%",
      }}
    >
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 15,
    backgroundColor: "#49A078",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  NewPlaylist: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
