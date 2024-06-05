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
import {
  setCurrentSong,
  setCurrentPosition,
  setAudioPlayer,
  setCurrentPlaylist,
  setIsPlaying,
} from "../redux/mediaPlayerSlice";
import { fetchSpotifyAccessToken } from "../redux/spotifyAccessTokenSlice";

import { Audio } from "expo-av";
import AudioService from "../service/audioService";
import { getTrack } from "../service/songService";

const SongItem = ({ input, songList }) => {
  const navigation = useNavigation();
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  const { mediaPlayer } = useSelector((state) => state.mediaPlayer);
  const {
    currentSong,
    currentPosition,
    currentSound,
    audioPlayer,
    currentTime,
    isPlaying,
    playlist,
  } = useSelector((state) => state.mediaPlayer);
  const dispatch = useDispatch();

  const handleSongChange = async (song) => {};

  const preloadPlaylist = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: false,
      });
      const playlistAudio = [];
      for (const song of playlist) {
        const audioInstance = await Audio.Sound.createAsync({
          uri: song.preview_url,
        });
        playlistAudio.push(audioInstance);
      }
      dispatch(setAudioPlayer(playlistAudio));
      dispatch(setIsPlaying(true));
      console.log(isPlaying);
    } catch (error) {
      console.error("Error loading sound:", error);
      alert("Error loading sound: " + error);
    }
  };

  const getCurrentSongIndex = () => {
    return songList.findIndex((item) => item.id === input.id);
  };

  const currentSongIndex = getCurrentSongIndex();

  const MoveToPlaySong = async () => {
    let service = new AudioService();
    await service.loadPlaylist(songList);
    service.currentSong = input;
    service.currentPlaylist = songList;
    service.currentAudioIndex = currentSongIndex;
    service.playCurrentAudio();
    navigation.navigate("PlaySong", {
      song: service.currentSong,
    });
  };

  const [image, setImage] = useState(null);

  useEffect(() => { 
    const getSongImg = async () => {
      try {
        if (accessTokenForSpotify) {
          const songData = await getTrack(accessTokenForSpotify, input.id);
          setImage(songData.album.image);
        } else {
          alert("accessToken: " + accessTokenForSpotify);
        }
      } catch (error) {
        console.error("Error fetching get song image:", error);
      }
    };
    getSongImg();
  }, [accessTokenForSpotify]);
  
  return (
    <TouchableOpacity style={styles.trackContainer} onPress={MoveToPlaySong}>
      {input.album && input.album.image ? (
        <Image source={{ uri: input.album.image }} style={styles.circle} />
      ) : (
        <Image
          source={{ uri: image }}
          // source={require("../assets/images/logoSEarn.png")}
          style={styles.circle}
        />
      )}
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
    backgroundColor: "black",
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
