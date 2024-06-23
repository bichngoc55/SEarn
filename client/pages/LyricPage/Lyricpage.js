import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
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
import MenuOfPlaysong from "../../components/MenuOfPlaysong/MenuOfPlaysong";
//import { ScrollView } from "react-native-gesture-handler";

const LyricPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let service = new AudioService();
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const [lyric, setLyric] = useState("Loading lyric...");

  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  // useEffect(() => {
  //   dispatch(fetchSpotifyAccessToken());
  // }, [dispatch]);
  useEffect(() => {
    getLyric();
    if (isFocused) {
      const handlePlaybackStatus = ({ progress, total }) => {
        setProgress(progress);
        setTotal(total);
      };
      service.registerPlaybackStatusCallback(handlePlaybackStatus);
    }
    return () => {};
  }, [service.currentTime]);
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
  const [liked, setLiked] = useState();
  const [likedSongList, setLikedSongList] = useState([]);

  // get liked song list on db
  useEffect(() => {
    const getLikedSong = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:3005/auth/${user._id}/getLikedSongs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const likedSong = await response.json();
        setLikedSongList(likedSong);
      } catch (error) {
        alert("Error in likedsong: " + error);
      }
    };
    getLikedSong();
  }, [user?._id, accessToken]);

  //add like song to db
  const addToLikedSongs = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/addLikedSongs`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike song on db
  const unlikeSong = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/unlikeSongs`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };

  //is song liked or not
  useEffect(() => {
    setLiked(likedSongList?.includes(service.currentSong.id));
  }, [service.currentSong.id, likedSongList]);

  //Handle like/unlike action
  const handleLikeUnlikeSong = async (songId) => {
    if (likedSongList?.includes(songId)) {
      await unlikeSong(songId);
      setLikedSongList(likedSongList.filter((id) => id !== songId));
    } else {
      await addToLikedSongs(songId);
      setLikedSongList([...likedSongList, songId]);
    }
  };
  const handleLike = () => {
    handleLikeUnlikeSong(service.currentSong.id);
    setLiked(!liked);
  };
  const moveToArtistDetail = async (artistId) => {
    try {
      if (accessTokenForSpotify) {
        const artistData = await getArtist(accessTokenForSpotify, artistId);
        navigation.navigate("ArtistDetail", {
          artist: artistData,
        });
      } else alert("accessToken: " + accessTokenForSpotify);
    } catch (error) {
      console.error("Error fetching move to artist hehe:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: service.currentSong.album.image }}
        resizeMode="cover"
        style={styles.imageContainer}
      >
        <>
          <View style={styles.overlay} />
          <View style={styles.headerL}>
            <Ionicons
              name="arrow-back-circle"
              size={scale(30)}
              color="#737373"
              onPress={navigation.goBack}
            />
            <Text style={styles.headerText} onPress={() => navigation.goBack()}>
              Now playing
            </Text>
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="#737373"
              onPress={toggleModal}
            />
          </View>
          <MenuOfPlaysong
            visible={modalVisible}
            onClose={toggleModal}
            song={service.currentSong}
          />
          <ScrollView style={{ marginTop: "3%", flex: 1 }}>
            <Text style={styles.lyricText}>{lyric}</Text>
          </ScrollView>
        </>
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
                {service.currentSong.artists.map((artist, index) => (
                  <TouchableOpacity
                    key={artist.id}
                    onPress={() => moveToArtistDetail(artist.id)}
                  >
                    {index < service.currentSong.artists.length - 1 ? (
                      <Text style={styles.songartist}>{artist.name}, </Text>
                    ) : (
                      <Text style={styles.songartist}>{artist.name} </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </Text>
            </View>
            <TouchableOpacity onPress={handleLike}>
              <Ionicons
                style={styles.heartBtn}
                name={liked ? "heart" : "heart-outline"}
                size={scale(30)}
                color="#FED215"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Slider
              style={{ width: "100%", marginVertical: "5%" }}
              minimumTrackTintColor="#FED215"
              maximumTrackTintColor="#2b2b2b"
              thumbTintColor="#FED215"
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
                  service.shufflePlaylist();
                }}
              />
            ) : (
              <Ionicons
                name="shuffle"
                size={scale(20)}
                color="#737373"
                onPress={() => {
                  service.shufflePlaylist();
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
    marginLeft: "5.1%",
    marginRight: "5.1%",
    height: scale(35),
    alignItems: "center",
    marginTop: "5%",

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
    height: "100%",
    width: "100%",
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
    paddingHorizontal: "5.1%",
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
