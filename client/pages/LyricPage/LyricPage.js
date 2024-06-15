import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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
import AudioService from "../../service/audioService";
//import { ScrollView } from "react-native-gesture-handler";

const LyricPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  let service = new AudioService();
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [lyric, setLyric] = useState("Loading lyric...");
  useEffect(() => {
    // service.registerPlaybackStatusCallback(handlePlaybackStatusUpdate);
    const handlePlaybackStatus = ({ progress, total }) => {
      setProgress(progress);
      setTotal(total);
    };
    getLyric();
    console.log(progress);

    service.registerPlaybackStatusCallback(handlePlaybackStatus);

    // const intervalId = setInterval(
    //   handlePlaybackStatus({ progress, total }),
    //   1000
    // );
    return () => {
      //service.unregisterPlaybackStatusCallback(handlePlaybackStatus);
    };
  }, [service.currentSound]);
  const formatTime = (timeInMillis) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const getLyric = async () => {
    const response = await axios.get(
      `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${service.currentSong.artists[0].name}&apikey=63a9e2c4de53b2981cc9b3a8df6b9f32&q_track=${service.currentSong.name}`
    );

    const songM = response.data;
    const songId = songM.message.body.track_list[0].track.track_id;
    const response2 = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${songId}&apikey=63a9e2c4de53b2981cc9b3a8df6b9f32`
    );

    const lyric = response2.data.message;
    if (lyric.body.length != 0) {
      setLyric(lyric.body.lyrics.lyrics_body);
    } else {
      setLyric("No lyrics support available");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: service.currentSong.album.image }}
        resizeMode="cover"
        style={styles.imageContainer}
      >
        <View style={styles.overlay} />
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
        <ScrollView style={{ marginTop: "3%" }}>
          <Text style={styles.lyricText}>{lyric}</Text>
        </ScrollView>
        <View style={styles.Bottom}>
          <View style={styles.textIcon}>
            <View style={styles.imageContainCircle}>
              <Image
                source={{ uri: service.currentSong.album.image }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: scale(50),
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.songname}>{service.currentSong.name}</Text>
              <Text style={styles.songartist}>
                {service.currentSong.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </Text>
            </View>
            <Ionicons name="heart-outline" size={scale(25)} color="#FED215" />
          </View>
          <View>
            <Slider
              style={{ width: "100%", height: "100%" }}
              minimumTrackTintColor="#FED215"
              maximumTrackTintColor="#2b2b2b"
              value={service.currentTime}
              minimumValue={0}
              maximumValue={service.currentTotalTime}
              onValueChange={(value) => {
                service.currentTime = value;
                service.isGetCoin = false;
                service.currentSound.sound.setPositionAsync(value);
              }}
            />
          </View>
          <View style={styles.textDuration}>
            <Text style={styles.songartist}>
              {formatTime(service.currentTime)}
            </Text>
            <Text style={styles.songartist}>
              {formatTime(service.currentTotalTime)}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {service.isRepeat ? (
              <Feather
                name="repeat"
                size={scale(20)}
                color="#FED215"
                onPress={() => {
                  service.isRepeat = false;
                }}
              />
            ) : (
              <Feather
                name="repeat"
                size={scale(20)}
                color="#737373"
                onPress={() => {
                  service.isRepeat = true;
                  service.isShuffle = false;
                }}
              />
            )}
            <FontAwesome6
              name="backward-step"
              size={scale(20)}
              color="#737373"
              onPress={() => {
                service.playPreviousAudio();
              }}
            />
            {service.isPlay ? (
              <View
                style={styles.circle}
                onPress={() => {
                  service.currentSound.sound.pauseAsync();
                  service.isPlay = false;
                }}
              >
                <FontAwesome5
                  name="pause"
                  size={scale(22)}
                  color="black"
                  onPress={() => {
                    service.currentSound.sound.pauseAsync();
                    service.isPlay = false;
                  }}
                />
              </View>
            ) : (
              <FontAwesome
                name="play-circle"
                size={scale(50)}
                color="#FED215"
                onPress={() => {
                  service.currentSound.sound.playAsync();
                  service.isPlay = true;
                }}
              />
            )}

            <FontAwesome6
              name="forward-step"
              size={scale(20)}
              color="#737373"
              onPress={() => {
                service.playNextAudio();
              }}
            />
            {service.isShuffle ? (
              <Ionicons
                name="shuffle"
                size={scale(20)}
                color="#FED215"
                onPress={() => {
                  service.isShuffle = false;
                }}
              />
            ) : (
              <Ionicons
                name="shuffle"
                size={scale(20)}
                color="#737373"
                onPress={() => {
                  service.isShuffle = true;
                  service.isRepeat = false;
                }}
              />
            )}
          </View>
        </View>
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
    fontSize: scale(16),
    fontFamily: "regular",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: "5%",
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
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  Bottom: {
    width: "100%",
    backgroundColor: "#1C1B1B",
    paddingHorizontal: "8.48%",
    paddingTop: "4.48%",
  },
  textIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  songname: {
    color: "#FFFFFF",
    fontFamily: "bold",
    fontFamily: "semiBold",
    marginBottom: scale(5),
  },
  songartist: {
    color: "#FFFFFF",
    fontFamily: "regular",
    fontSize: scale(10),
  },
  imageContainCircle: {
    height: scale(50),
    width: scale(50),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginRight: scale(15),
  },
  textDuration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    marginHorizontal: "10%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circle: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(50),
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LyricPage;
