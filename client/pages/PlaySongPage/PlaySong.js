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

let audioPlayer;

const PlaySongPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  const { mediaPlayer } = useSelector((state) => state.mediaPlayer);
  const {
    currentSong,
    currentPosition,
    currentSound,
    currentTime,
    isPlaying,
    playlist,
  } = useSelector((state) => state.mediaPlayer);
  const [isShuffe, setIsShuffe] = useState(false);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    preloadPlaylist();
    if (audioPlayer != null) {
      audioPlayer.unloadAsync();
    }
    const intervalId = setInterval(setUpProgress, 1000);
    return () => {
      // Không cần dọn dẹp âm thanh vì nó được quản lý bên ngoài component
    };
  }, []);

  const preloadPlaylist = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: false,
      });
      for (const song of playlist) {
        await Audio.Sound.createAsync({ uri: song.preview_url });
      }

      audioPlayer = new Audio.Sound();
      const status = await audioPlayer.loadAsync({
        uri: currentSong.preview_url,
      });

      // Listen for audio interruptions
      audioPlayer.setOnPlaybackStatusUpdate((status) => {
        if (status.isInterruptedByOtherAudio) {
          audioPlayer.pauseAsync();
        }
      });

      //await audioPlayer.playAsync();
      await audioPlayer.playFromPositionAsync(currentPosition * 1000);
      dispatch(setIsPlaying(true));
      console.log(isPlaying);
      setUpProgress();
    } catch (error) {
      console.error("Error loading sound:", error);
      alert("Error loading sound: " + error);
    }
  };

  const setUpProgress = async () => {
    if (isPlaying && audioPlayer) {
      try {
        const status = await audioPlayer.getStatusAsync();

        setProgress(status.positionMillis);
        setTotal(status.durationMillis);
        dispatch(setCurrentTime(status.positionMillis));

        if (
          Math.floor(status.positionMillis / 1000) ==
          Math.floor(status.durationMillis / 1000)
        ) {
          console.log("Hết bài");
          await audioPlayer.pauseAsync();
          if (isShuffe == true) {
            console.log("playing random");
            let index = Math.floor(Math.random() * playlist.length);
            while (index == currentPosition) {
              index = Math.floor(Math.random() * playlist.length);
            }
            dispatch(setCurrentSong(playlist[index]));
            dispatch(setCurrentPosition(index));
            dispatch(setIsPlaying(true));
            audioPlayer.setPositionAsync(0);
            dispatch(setCurrentTime(0));
            await audioPlayer.unloadAsync();
            await audioPlayer.loadAsync({
              uri: playlist[index].preview_url,
            });
            await audioPlayer.playAsync();
          } else {
            console.log("playing next");
            await dispatch(
              playNextSong({ audioPlayer, playlist, currentPosition })
            );
          }
        }
      } catch (error) {}
    } else {
      if (audioPlayer) {
        await audioPlayer.pauseAsync();
      }
    }
  };

  const formatTime = (timeInMillis) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

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
      <View style={styles.imageContain}>
        <Image
          source={{ uri: currentSong.album.image }}
          style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
        />
      </View>
      <View style={styles.textIcon}>
        <View>
          <Text style={styles.songname}>{currentSong.name}</Text>
          <Text style={styles.songartist}>
            {currentSong.artists.map((artist) => artist.name).join(", ")}
          </Text>
        </View>
        <Ionicons name="heart-outline" size={scale(30)} color="#FED215" />
      </View>
      <View style={styles.headerL}>
        <Slider
          style={{ width: "100%", height: "100%" }}
          minimumTrackTintColor="#FED215"
          maximumTrackTintColor="#2b2b2b"
          value={currentTime}
          minimumValue={0}
          maximumValue={total}
          onValueChange={(value) => {
            dispatch(setCurrentTime(value));
            audioPlayer.setPositionAsync(value);
          }}
        />
      </View>
      <View style={styles.textDuration}>
        <Text style={styles.songartist}>{formatTime(currentTime)}</Text>
        <Text style={styles.songartist}>{formatTime(total)}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Feather
          name="repeat"
          size={scale(25)}
          color="#737373"
          onPress={() => {
            audioPlayer.setPositionAsync(0);
          }}
        />
        <FontAwesome6
          name="backward-step"
          size={scale(25)}
          color="#737373"
          onPress={() => {
            dispatch(playBackSong({ audioPlayer, playlist, currentPosition }));
          }}
        />
        {isPlaying ? (
          <View
            style={styles.circle}
            onPress={() => {
              console.log("Đã nhấn pause");
              dispatch(playPause({ audioPlayer, isPlaying }));
            }}
          >
            <FontAwesome5
              name="pause"
              size={scale(27)}
              color="black"
              onPress={() => {
                console.log("Đã nhấn pause");
                dispatch(playPause({ audioPlayer, isPlaying }));
              }}
            />
          </View>
        ) : (
          <FontAwesome
            name="play-circle"
            size={scale(70)}
            color="#FED215"
            onPress={() => {
              dispatch(playPause({ audioPlayer, isPlaying }));
              console.log("Đã nhấn nút pause");
            }}
          />
        )}

        <FontAwesome6
          name="forward-step"
          size={scale(25)}
          color="#737373"
          onPress={() => {
            dispatch(playNextSong({ audioPlayer, playlist, currentPosition }));
          }}
        />
        {isShuffe ? (
          <Ionicons
            name="shuffle"
            size={scale(25)}
            color="#FED215"
            onPress={() => {
              console.log("shuffe: " + isShuffe);
              setIsShuffe(false);
            }}
          />
        ) : (
          <Ionicons
            name="shuffle"
            size={scale(25)}
            color="#737373"
            onPress={() => {
              console.log("shuffe: " + isShuffe);
              setIsShuffe(true);
            }}
          />
        )}
      </View>
      <View style={styles.bottomContain}>
        <Entypo name="chevron-small-up" size={scale(30)} color="#737373" />
        <Text style={styles.songartist}>Lyrics</Text>
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
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
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
  imageContain: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    marginTop: "4.68%",
    borderRadius: 50,
    height: scale(350),
    backgroundColor: "white",
  },
  textIcon: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    marginTop: "6.68%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  songname: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: scale(16),
    marginBottom: scale(5),
  },
  songartist: {
    color: "#FFFFFF",
    fontWeight: "300",
    fontSize: scale(12),
  },
  iconContainer: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomContain: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  textDuration: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PlaySongPage;
