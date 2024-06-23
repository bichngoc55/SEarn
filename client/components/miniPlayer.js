import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import scale from "../constant/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Animated, PanResponder } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import AudioService from "../service/audioService";

const MiniPlayer = () => {
  let service = new AudioService();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(0);
  const pan = React.useRef(new Animated.ValueXY()).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (isFocused) {
      setName(service.currentSong.name);
    }
  }, [isFocused]);

  const [track, setTrack] = useState({
    title: "No playing track",
    image: require("../assets/images/logoSEarn.png"),
    artists: "Not found artists",
  });
  const OpenPlaySong = async () => {
    if (service?.currentSong) {
      navigation.navigate("PlaySong", {
        song: service.currentSong,
      });
    } else alert("No audio available");
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: translateX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 50) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            if (service?.currentSound?.sound != null) {
              service.currentSound.sound.stopAsync();
            }
            setIsVisible(false);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: 0, // Reset position
      useNativeDriver: true,
    }).start();
    setIsVisible(true);
  }, [service.currentSong, translateX]);
  return isVisible ? (
    <Animated.View
      style={{ transform: [{ translateX }] }}
      {...panResponder.panHandlers}
    >
      <View style={styles.container} activeOpacity={0.9}>
        <TouchableOpacity
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          onPress={() => {
            OpenPlaySong();
          }}
        >
          <View style={styles.imageContainer}>
            {service.currentSong ? (
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: scale(50),
                }}
                source={{
                  uri: service.currentSong.album.image,
                }}
              />
            ) : (
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: scale(50),
                }}
                source={track.image}
              />
            )}
          </View>

          {service.currentSong ? (
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.songname}
              >
                {name}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.songartist}
              >
                {service.currentSong.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </Text>
            </View>
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.songname}>{track.title}</Text>
              <Text style={styles.songartist}>Not found artists</Text>
            </View>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginLeft: "5%",
            alignItems: "center",
            justifyContent: "space-between",
            width: "25%",
          }}
        >
          <FontAwesome6
            name="backward-step"
            size={scale(20)}
            color="#737373"
            onPress={() => {
              if (service.currentSound.sound) {
                service.playPreviousAudio();
              }
            }}
          />
          {service.currentSong ? (
            service.isPlay ? (
              <View
                style={styles.circle}
                onPress={() => {
                  service.currentSound.sound.pauseAsync();
                  console.log("Dừng âm thanh");
                  service.isPlay = false;
                }}
              >
                <FontAwesome5
                  name="pause"
                  size={scale(15)}
                  color="black"
                  onPress={() => {
                    service.currentSound.sound.pauseAsync();
                    console.log("Dừng âm thanh");
                    service.isPlay = false;
                  }}
                />
              </View>
            ) : (
              <FontAwesome
                name="play-circle"
                size={scale(40)}
                color="#FED215"
                onPress={() => {
                  service.currentSound.sound.playAsync();
                  console.log("Phát âm thanh");
                  service.isPlay = true;
                }}
              />
            )
          ) : (
            <FontAwesome
              name="play-circle"
              size={scale(40)}
              color="#FED215"
              onPress={() => {
                alert("No audio available");
              }}
            />
          )}

          <FontAwesome6
            name="forward-step"
            size={scale(20)}
            color="#737373"
            onPress={() => {
              if (service.currentSound.sound) {
                service.playNextAudio();
              }
            }}
          />
        </View>
      </View>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: "3%",
    paddingHorizontal: "6.48%",
    width: "100%",
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    borderRadius: scale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: scale(50),
    height: scale(50),
    marginRight: scale(15),
  },
  textContainer: {
    flex: 1,
  },
  songname: {
    color: "#FFFFFF",
    fontFamily: "semiBold",
    fontSize: scale(14),
    marginBottom: scale(5),
  },
  songartist: {
    color: "#FFFFFF",
    fontFamily: "regular",
    fontSize: scale(12),
  },
  circle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(30),
    backgroundColor: "#FED215",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default MiniPlayer;
