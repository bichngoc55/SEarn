import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";

import scale from "../constant/responsive";
import { COLOR } from "../constant/color";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useSelector, dispatch, useDispatch  } from "react-redux";
import AudioService from "../service/audioService";
import { getTrack } from "../service/songService";
import { fetchSpotifyAccessToken } from "../redux/spotifyAccessTokenSlice";
const RecentlyPlayingSong = ({ recentlyPlayingSong, moveToPlaySong }) => {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const [progress, setProgress] = useState(0);
//   const [total, setTotal] = useState(0);

//   const { user } = useSelector((state) => state.user);
//   const accessToken = useSelector((state) => state.user.accessToken);
//   const { accessTokenForSpotify } = useSelector(
//     (state) => state.spotifyAccessToken
//   );

//   const [recentlyPlayingSong, setRecentlyPlayingSong] = useState();
//   const [playSong, setPlaySong] = useState();
//   const [name, setName] = useState("");
//   const dispatch = useDispatch();
//   let service = new AudioService();

//   const MoveToPlaySong = async () => {
//     //service.loadSong();
//     if (service.currentSong != null) {
//       navigation.navigate("PlaySong", {
//         song: service.currentSong,
//       });
//     } else if (recentlyPlayingSong != null) {
//       service.currentTime = 0;
//       service.currentSong = recentlyPlayingSong;
//       service.playCurrentAudio();
//       service.isGetCoin = true;
//       navigation.navigate("PlaySong", {
//         song: service.currentSong,
//       });
//     } else alert("No audio available");
//   };
  

//   //get in4 recentlySong from spotify
//   useEffect(() => {
//     dispatch(fetchSpotifyAccessToken());
//     const fetchRecentlyPlayingSong = async () => {
//       try {
//         if (accessTokenForSpotify) {
//           const song = await getTrack(accessTokenForSpotify, user?.recentListeningSong);
//           setRecentlyPlayingSong(song);
//           //service.currentSong = song;
//           console.log("Get recentListeningSong from db: " + song.name);
//         } 
//         // else alert("Chưa có accessTokenForSpotify");
//       } catch (error) {
//         console.error(
//           "Error fetching recently playing song in HomeScreen:",
//           error
//         );
//       }
//     };
//     if (accessTokenForSpotify && user?.recentListeningSong && service.currentSong == null) {
//       fetchRecentlyPlayingSong();
//     }

//   }, [user?._id, accessTokenForSpotify, user?.recentListeningSong, service.currentSong]);


//   //update recentlySong
//   const updateRecentlyPlayingSong = async (songId) => {
//     fetch(`http://10.0.2.2:3005/auth/${user?._id}/updateRecentListeningSong`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ songId }),
//     })
//       .then((response) => response.json())
//       .then((updatedUser) => console.log(updatedUser))
//       .catch((error) => console.error(error));
//   };

//   useEffect(() => {
//     const newRecentlyPlayingSong = async () => {
//       try {
//         if (accessTokenForSpotify) {
//           if (
//             recentlyPlayingSong?.id !== service?.currentSong?.id &&
//             service.currentSong
//           ) {
//             await updateRecentlyPlayingSong(service.currentSong.id);
//             // fetchRecentlyPlayingSong()
//             setRecentlyPlayingSong(service.currentSong)
//           }
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching recently playing song in HomeScreen:",
//           error
//         );
//       }
//     };
//     if (
//       accessTokenForSpotify &&
//       recentlyPlayingSong !== service.currentSong &&
//       user?.recentListeningSong
//     ) {
//       newRecentlyPlayingSong(); 
//     }
//   }, [user?._id, accessTokenForSpotify, service?.currentSong]);
//   const serviceRef = useRef(null);
//   useEffect(() => {
//     const handlePlaybackStatus = ({ progress, total }) => {
//         setTotal(total);
//         console.log("dang cap nhap recently song");
//         setRecentlyPlayingSong(service.currentSong);
//     };
//     if (isFocused) {
//         // if (!serviceRef.current) {
//         //     serviceRef.current = new AudioService();
//         //   }
//         //   const service = serviceRef.current;
//         service.registerPlaybackStatusCallback(handlePlaybackStatus);
//         return () => {
//             service.unregisterPlaybackStatusCallback(handlePlaybackStatus);
//           };
//     }
//   }, [service.currentSong, isFocused]);

  return (
    // <View style={styles.recentSongContainer}>
    // {recentlyPlayingSong ? (
    //     <>
    //     <View
    //         style={{ flexDirection: "column", marginHorizontal: scale(10), width: scale(170), }}
    //     >
    //         <Text style={styles.songName}>{recentlyPlayingSong.name}</Text>
    //         <Text style={styles.artistsName}>
    //         {recentlyPlayingSong?.artists
    //             .map((artist) => artist.name)
    //             .join(", ")}{" "}
    //         </Text>
    //     </View>
    //     <TouchableOpacity onPress={MoveToPlaySong}>
    //         <Image
    //         source={{ uri: recentlyPlayingSong?.album?.image }}
    //         style={styles.circle}
    //         />
    //     </TouchableOpacity>
    //     </>
    // ) : (
    //     <>
    //     <View
    //         style={{
    //         flexDirection: "column",
    //         marginHorizontal: scale(10),
    //         width: scale(170),
    //         }}
    //     >
    //         <Text style={styles.artistsName}>
    //         Chưa có bài hát nào được phát gần đây
    //         </Text>
    //     </View>
    //     <View style={styles.circle} />
    //     </>
    // )}
    // </View>
    <View style={styles.recentSongContainer}>
      {recentlyPlayingSong ? (
        <>
          <View style={{ flexDirection: "column", marginHorizontal: scale(10), width: scale(170) }}>
            <Text style={styles.songName}>{recentlyPlayingSong.name}</Text>
            <Text style={styles.artistsName}>
              {recentlyPlayingSong?.artists.map((artist) => artist.name).join(", ")}
            </Text>
          </View>
          <TouchableOpacity onPress={moveToPlaySong}>
            <Image
              source={{ uri: recentlyPlayingSong?.album?.image }}
              style={styles.circle}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ flexDirection: "column", marginHorizontal: scale(10), width: scale(170) }}>
            <Text style={styles.artistsName}>
              Chưa có bài hát nào được phát gần đây
            </Text>
          </View>
          <View style={styles.circle} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recentSongContainer: {
    width: "100%",
    height: scale(200),
    backgroundColor: "rgba(35, 35, 35, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    borderColor: COLOR.btnBackgroundColor,
    borderBottomWidth: 1,
  },
  circle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(100),
    marginHorizontal: scale(10),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  songName: {
    fontSize: scale(17),
    fontFamily: "semiBold",
    color: COLOR.btnBackgroundColor,
    marginBottom: scale(5),
  },
  artistsName: {
    fontSize: scale(15),
    fontFamily: "regular",
    color: "white",
  },
});

export default RecentlyPlayingSong;
