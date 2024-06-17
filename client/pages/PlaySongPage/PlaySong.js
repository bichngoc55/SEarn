import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import BottomSheetModal, {
  useBottomSheetController,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { getArtist } from "../../service/artistService";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import MenuOfPlaysong from "../../components/MenuOfPlaysong/MenuOfPlaysong";
import AudioService from "../../service/audioService";

const PlaySongPage = ({ route }) => {
  const { song } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  let service = new AudioService();
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const isFocused = useIsFocused();
  const snapPoints = ["50%", "100%"];
  let bottomSheetRef = useRef(null);

  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (isFocused) {
      const handlePlaybackStatus = ({ progress, total }) => {
        setProgress(progress);
        setTotal(total);
      };
      //console.log("progress" + progress)
      service.registerPlaybackStatusCallback(handlePlaybackStatus);
    }

    // const intervalId = setInterval(
    //   handlePlaybackStatus({ progress, total }),
    //   1000
    // );
    return () => {};
  }, [service.currentTime]);

  const {
    currentSong,
    currentPosition,
    currentSound,
    audioPlayer,
    currentTime,
    isPlaying,
    playlist,
  } = useSelector((state) => state.mediaPlayer);

  const formatTime = (timeInMillis) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const MoveToLyric = () => {
    navigation.navigate("Lyric", {
      song: song,
    });
  };

  const [img, setImage] = useState(null);

  useEffect(() => {
    const getSongImg = async () => {
      try {
        if (accessTokenForSpotify) {
          const songData = await getTrack(
            accessTokenForSpotify,
            service.currentSong.id
          );
          setImage(songData.album.img);
        } else {
          alert("accessToken: " + accessTokenForSpotify);
        }
      } catch (error) {
        console.error("Error fetching get song image:", error);
      }
    };
    getSongImg();
  }, [accessTokenForSpotify]);

  const [likedSongList, setLikedSongList] = useState([]);
  const [liked, setLiked] = useState();
  //get liked song list from db
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

  useEffect(() => {
    setLiked(likedSongList?.includes(song?.id));
  }, [song?.id, likedSongList]);
  // Handle like/unlike action
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
    handleLikeUnlikeSong(song.id);
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
      <View style={styles.headerL}>
        <Ionicons
          name="arrow-back-circle"
          size={scale(30)}
          color="#737373"
          onPress={navigation.goBack}
        />
        <Text style={styles.headerText}>Now playing</Text>
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
      <View style={styles.imageContain}>
        {service.currentSong && service.currentSong.album ? (
          <Image
            source={{ uri: service.currentSong.album.image }}
            style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
          />
        ) : (
          <Image
            source={{ uri: img }}
            style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
          />
        )}
      </View>
      <View style={styles.textIcon}>
        <View>
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
      <View style={styles.headerL}>
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
        <Text style={styles.songartist}>{formatTime(service.currentTime)}</Text>
        <Text style={styles.songartist}>
          {formatTime(service.currentTotalTime)}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {service.isRepeat ? (
          <Feather
            name="repeat"
            size={scale(25)}
            color="#FED215"
            onPress={() => {
              service.isRepeat = false;
            }}
          />
        ) : (
          <Feather
            name="repeat"
            size={scale(25)}
            color="#737373"
            onPress={() => {
              service.isRepeat = true;
              service.isShuffle = false;
            }}
          />
        )}
        <FontAwesome6
          name="backward-step"
          size={scale(25)}
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
              console.log(service.isPlay);
              service.isPlay = false;
            }}
          >
            <FontAwesome5
              name="pause"
              size={scale(27)}
              color="black"
              onPress={() => {
                service.currentSound.sound.pauseAsync();
                console.log(service.isPlay);
                service.isPlay = false;
              }}
            />
          </View>
        ) : (
          <FontAwesome
            name="play-circle"
            size={scale(70)}
            color="#FED215"
            onPress={() => {
              service.currentSound.sound.playAsync();
              console.log(service.isPlay);
              service.isPlay = true;
            }}
          />
        )}

        <FontAwesome6
          name="forward-step"
          size={scale(25)}
          color="#737373"
          onPress={() => {
            service.playNextAudio();
          }}
        />
        {service.isShuffle ? (
          <Ionicons
            name="shuffle"
            size={scale(25)}
            color="#FED215"
            onPress={() => {
              service.isShuffle = false;
            }}
          />
        ) : (
          <Ionicons
            name="shuffle"
            size={scale(25)}
            color="#737373"
            onPress={() => {
              service.isShuffle = true;
              service.isRepeat = false;
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.bottomContain}
        onPress={() => {
          MoveToLyric();
        }}
      >
        <Entypo name="chevron-small-up" size={scale(30)} color="#737373" />
        <Text style={styles.songartist}>Lyrics</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    marginTop: "2.68%",
    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: scale(16),
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
