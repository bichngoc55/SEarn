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
import scale from "../constant/responsive";
import { useSelector, useDispatch, Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import PlaySongPage from "../pages/PlaySongPage/PlaySong";
import { useNavigation } from "@react-navigation/native";
import { setCurrentSong } from "../redux/mediaPlayerSlice";

const SongItem = ({ input }) => {
  const navigation = useNavigation();
  const { mediaPlayer } = useSelector((state) => state.mediaPlayer);
  const { currentSong, currentPosition, isPlaying } = useSelector(
    (state) => state.mediaPlayer
  );
  const dispatch = useDispatch();

  const handleSongChange = (song) => {
    dispatch(setCurrentSong(song));
    dispatch(setCurrentPosition(0));
    dispatch(togglePlayPause(true));
  };

  const MoveToPlaySong = () => {
    handleSongChange(input);
    navigation.navigate("PlaySong", {
      song: input,
    });
  };
  return (
    <TouchableOpacity style={styles.trackContainer} onPress={MoveToPlaySong}>
      <Image source={{ uri: input.album.image }} style={styles.circle} />
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Text style={styles.textName} numberOfLines={1} ellipsizeMode="tail">
          {input.name}
        </Text>
        <Text style={styles.textArtist}>
          {input.artists.map((artist) => artist.name).join(", ")}{" "}
        </Text>
      </View>
      <Ionicons name="heart-outline" size={scale(25)} color="#FED215" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  circle: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(60),
    backgroundColor: "#49A078",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  textName: {
    fontSize: scale(14),
    color: "white",
    marginRight: scale(10),
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    marginRight: scale(10),
  },
  trackContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
});

export default SongItem;
