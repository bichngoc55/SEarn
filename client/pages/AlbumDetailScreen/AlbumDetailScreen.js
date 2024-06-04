import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbumTrack } from "../../service/albumTracksService";
import { useSelector, useDispatch } from "react-redux";
import SongItem from "../../components/songItem";

const AlbumDetailScreen = ({ route }) => {
  const { album } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const { accessToken, expires_in: expiresIn } = await dispatch(
          fetchSpotifyAccessToken()
        ).unwrap();
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        setTokenExpiration(expirationTime);
        console.log("expire time  Access Token:", expiresIn);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    const checkTokenExpiration = () => {
      if (tokenExpiration && new Date().getTime() >= tokenExpiration) {
        fetchAccessToken();
      } else {
        const interval = setInterval(checkTokenExpiration, 55 * 60 * 1000);
        return () => clearInterval(interval);
      }
    };
    checkTokenExpiration();
  }, [dispatch]);

  useEffect(() => {
    if (accessTokenForSpotify) {
      console.log(
        "Access Token in album detail screen :",
        accessTokenForSpotify
      );
    }
  }, [user, accessTokenForSpotify]);

  const [albumTracks, setAlbumTracks] = useState([]);

  useEffect(() => {
    const fetchAlbumTracks = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getAlbumTrack(
            accessTokenForSpotify,
            album.id
          );
          const albumTracksPromises = [...items];
          const albumTrackData = await Promise.all(albumTracksPromises);
          albumTrackData.forEach((albumTrack) => {});
          setAlbumTracks(albumTrackData);
          console.log(albumTracks);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching album tracks hehe:", error);
      }
      //     };
      //     fetchAlbumTracks();
      //   }, [accessTokenForSpotify, album.id]);
    };
  }, [user, accessTokenForSpotify]);

  //const [albumTracks, setAlbumTracks] = useState([]);

  useEffect(() => {
    const fetchAlbumTracks = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getAlbumTrack(
            accessTokenForSpotify,
            album.id
          );
          const albumTracksPromises = [...items];
          const albumTrackData = await Promise.all(albumTracksPromises);
          albumTrackData.forEach((albumTrack) => {});
          setAlbumTracks(albumTrackData);
          console.log(albumTracks);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching album tracks hehe:", error);
      }
    };
    fetchAlbumTracks();
  }, [accessTokenForSpotify, album.id]);

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.img_and_backBtn}>
        <Image
          source={{ uri: album.images[0].url }}
          style={styles.albumImg}
          resizeMode="cover"
        />
        <View style={styles.backButtonContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.albumName}>{album.name}</Text>
      <Text style={styles.textTotal_tracks}>
        Total tracks: {album.total_tracks}
      </Text>
      <View style={styles.content}>
        <View style={styles.flatlistContainer}>
          <FlatList
            data={albumTracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <SongItem input={item} songList={albumTracks} />;
            }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#121212",

    paddingBottom: scale(60),
  },
  img_and_backBtn: {
    width: "100%",
    height: scale(300),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  albumImg: {
    position: "absolute",
    width: "100%",
    aspectRatio: 1,
  },
  backButtonContainer: {
    marginTop: scale(25),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(35),
    height: scale(35),
    borderRadius: 17.5,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  albumName: {
    marginTop: scale(15),
    color: COLOR.hightlightText,
    fontSize: 24,
    fontFamily: "bold",
    alignSelf: "center",
  },
  textTotal_tracks: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
    fontFamily: "regular",
    marginVertical: scale(5),
    textAlign: "center",
  },
  content: {
    marginHorizontal: scale(10),
    flex: 1,
    marginTop: scale(10),
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});

export default AlbumDetailScreen;
