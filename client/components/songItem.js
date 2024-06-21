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
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import AudioService from "../service/audioService";
import { getTrack } from "../service/songService";

const SongItem = ({ input, songList, onLikeUnlike, isLiked }) => {
  const navigation = useNavigation();
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  // useEffect(() => {
  //   dispatch(fetchSpotifyAccessToken());
  // }, [dispatch]);

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

  const getCurrentSongIndex = () => {
    return songList.findIndex((item) => item.id === input.id);
  };

  const currentSongIndex = getCurrentSongIndex();

  const MoveToPlaySong = async () => {
    let service = new AudioService();
    service.currentSong = input;
    //service.loadSong();
    console.log(service.currentSong);
    service.currentPlaylist = songList;
    service.currentTime = 0;
    service.currentAudioIndex = currentSongIndex;
    service.playCurrentAudio();
    service.isGetCoin = true;
    service.isShuffle = false;
    console.log(service.currentSong);
    navigation.navigate("PlaySong", {});
  };

  const [image, setImage] = useState(null);

  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLike = () => {
    onLikeUnlike(input.id);
    setLiked(!liked);
  };

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
        <Text style={styles.textArtist} numberOfLines={1} ellipsizeMode="tail">
          {input.artists.map((artist) => artist.name).join(", ")}{" "}
        </Text>
      </View>
      <TouchableOpacity onPress={handleLike}>
        <Ionicons
          style={styles.heartBtn}
          name={isLiked ? "heart" : "heart-outline"}
          size={scale(25)}
          color="#FED215"
        />
      </TouchableOpacity>
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
    fontFamily: "semiBold",
    color: "white",
    marginRight: scale(10),
    fontSize: scale(14),
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    fontFamily: "regular",
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
