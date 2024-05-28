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
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { setCurrentSong } from "../../redux/mediaPlayerSlice";

let audioPlayer = null;

const PlaySongPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  const { mediaPlayer } = useSelector((state) => state.mediaPlayer);
  const { currentSong, currentPosition, isPlaying } = useSelector(
    (state) => state.mediaPlayer
  );
  const dispatch = useDispatch();

  const [currentSound, setCurrentSound] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeAndroid: true,
          shouldDuckAndroid: false,
        });

        if (currentSong.name != null) {
          // Dừng âm thanh hiện tại, nếu có
          if (audioPlayer) {
            await audioPlayer.stopAsync();
          }

          audioPlayer = new Audio.Sound();
          await audioPlayer.loadAsync({ uri: currentSong.preview_url });
          await audioPlayer.playAsync();
          setCurrentSound(currentSong.preview_url);
          dispatch(setCurrentSong(song));
        }
      } catch (error) {
        alert(error);
      }
    };

    loadSound();

    return () => {
      // Không cần dọn dẹp âm thanh vì nó được quản lý bên ngoài component
    };
  }, [currentSong]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerL}>
        <Ionicons name="arrow-back-circle" size={scale(30)} color="#737373" />
        <Text style={styles.headerText}>Now playing</Text>
        <Entypo name="dots-three-vertical" size={24} color="#737373" />
      </View>
      <View style={styles.imageContain}>
        <Image
          source={{ uri: song.album.image }}
          style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
        />
      </View>
      <View style={styles.textIcon}>
        <View>
          <Text style={styles.songname}>{song.name}</Text>
          <Text style={styles.songartist}>
            {song.artists.map((artist) => artist.name).join(", ")}
          </Text>
        </View>
        <Ionicons name="heart-outline" size={scale(30)} color="#FED215" />
      </View>
      <View style={styles.headerL}>
        <Slider
          style={{ width: "100%", height: "100%" }}
          minimumTrackTintColor="#FED215"
          maximumTrackTintColor="#2b2b2b"
        />
      </View>
      <View style={styles.textDuration}>
        <Text style={styles.songartist}>00:00</Text>
        <Text style={styles.songartist}>00:00</Text>
      </View>
      <View style={styles.iconContainer}>
        <Feather name="repeat" size={scale(25)} color="#737373" />
        <FontAwesome6 name="backward-step" size={scale(25)} color="#737373" />
        <FontAwesome name="play-circle" size={scale(70)} color="#FED215" />
        <FontAwesome6 name="forward-step" size={scale(25)} color="#737373" />
        <Ionicons name="shuffle" size={scale(25)} color="#737373" />
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
