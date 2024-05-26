import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import scale from "../../constant/responsive";
import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTrack } from "../../service/songService";
import { FontAwesome } from "@expo/vector-icons";

const PlaySongPage = ({ route }) => {
  const { song } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerL}>
        <Ionicons name="arrow-back-circle" size={scale(30)} color="#737373" />
        <Text style={styles.headerText}>Your liked song</Text>
        <View style={{ width: scale(30), height: scale(30) }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  circle: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(60),
    backgroundColor: "#49A078",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  headerL: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    height: scale(35),
    alignItems: "center",
    marginTop: "2.68%",
    marginBottom: "4.68%",
    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
  },
});

export default PlaySongPage;
