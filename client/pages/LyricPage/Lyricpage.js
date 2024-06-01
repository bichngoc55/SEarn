import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageView,
  FlatList,
  ImageBackground,
} from "react-native";
import scale from "../../constant/responsive";
import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTrack } from "../../service/songService";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import {
  setCurrentSong,
  setCurrentSound,
  setCurrentPosition,
  setCurrentPlaylist,
  setIsPlaying,
  setCurrentTime,
  playPause,
  playRandomSong,
  playNextSong,
  playBackSong,
} from "../../redux/mediaPlayerSlice";

const LyricPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerL}>
        <Ionicons
          name="arrow-back-circle"
          size={scale(30)}
          color="#737373"
          onPress={navigation.goBack}
        />
        <Text style={styles.headerText}>Now playing</Text>
        <Entypo name="dots-three-vertical" size={24} color="#737373" />
      </View>
      <ImageBackground
        source={{ uri: song.album.image }}
        resizeMode="cover"
        style={styles.imageContainer}
      >
        <View style={styles.overlay} />
        <Text style={styles.lyricText}>Hello lyric</Text>
      </ImageBackground>
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
  headerL: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    height: scale(35),
    alignItems: "center",
    marginTop: "2.68%",

    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
  },
  lyricText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    justifyContent: "center",
    flex: 1,
  },
  imageContainer: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default LyricPage;
