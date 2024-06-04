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
import ArtistAlbumItem from "../../components/artistAlbumItem";
import SongItem from "../../components/songItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getArtistAlbum } from "../../service/artistAlbumsService";
import { getArtistSong } from "../../service/artistSongService";
import { useSelector, useDispatch } from "react-redux";
import {  GestureHandlerRootView  } from "react-native-gesture-handler";

const ArtistDetailScreen = ({ route }) => {
  const { artist } = route.params;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);
      
  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (accessTokenForSpotify) {
    console.log("Access Token in useEffect artist:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [likedAlbumList, setLikedAlbumList] = useState([]);

  //get liked album list on db
  // useEffect(() => {
  //   const fetchLikedAlbumList = async () => {
  //     try {
  //       if (accessToken) {
  //         const { listLikedAlbums } = await getLikedAlbumList(accessToken, user._id);
  //         const albumIds = listLikedAlbums.map((likedAlbum) => likedAlbum.id);
  //         setLikedAlbumList(albumIds);
  //       }
  //       else alert("Chưa có accessToken");
  //     } catch (error) {
  //       console.error("Error fetching liked albums:", error);
  //     }
  //   };
  //   fetchLikedAlbumList();
  // }, [user?._id, accessToken]);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getArtistAlbum(accessTokenForSpotify, artist.id);
          const artistAlbumsPromises = [...items];
          const artistAlbumData = await Promise.all(artistAlbumsPromises);
          artistAlbumData.forEach((artistAlbum) => {});
          setArtistAlbums(artistAlbumData);

          const { tracks } = await getArtistSong(accessTokenForSpotify, artist.id);
          const artistSongsPromises = [...tracks];
          const artistSongData = await Promise.all(artistSongsPromises);
          artistSongData.forEach((artistSong) => {});
          setArtistSongs(artistSongData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching artists album hehe:", error);
      }
    };
    fetchArtistAlbums();
    }, [accessTokenForSpotify, artist.id]);

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.img_and_backBtn}>
        <Image source={{ uri: artist.images[0].url }}
        style={styles.artistImg}
        resizeMode="cover"/>
        <View style={styles.backButtonContainer}>
            <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
            </Pressable>
        </View>
      </View>
      <Text style={styles.artistName}>{artist.name}</Text>        
      <Text style={styles.textGenre}>
       Genres {artist.genres.map((genre) => genre.typeGenre).join(", ")}{" "}
      </Text>
      
      <GestureHandlerRootView style={styles.content}>
        <FlatList style={styles.flatlistContainer}
          data={artistSongs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Albums</Text>
              <View style={styles.flatlistContainer}>
                <FlatList
                  horizontal={true}
                  data={artistAlbums}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return <ArtistAlbumItem input={item} />;
                  }}
                  nestedScrollEnabled={true}
                />
              </View>
              <Text style={styles.title}>Top Songs</Text>
            </>
          }
          renderItem={({ item }) => {
            return <SongItem input={item} songList={artistSongs}/>;
          }}
          nestedScrollEnabled={true}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingBottom: scale(60)
  },
  img_and_backBtn: {
    width: "100%",
    height: scale(250),
    backgroundColor: "red",
    overflow: "hidden", 
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20)
  },
  artistImg:{
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
  artistName:{
    marginTop: scale(15),
    color: COLOR.hightlightText,
    fontSize: 24,
    fontFamily: "bold",
    alignSelf: "center"
  },
  textGenre: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
    fontFamily: "regular",
    marginVertical: scale(5),
    textAlign:"center"
  },
  content:{
    marginHorizontal: scale(10),
    flex:1
  },
  title: {
    marginVertical: scale(10),
    color: "white",
    fontSize: 20,
    fontFamily: "bold",
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});

export default ArtistDetailScreen;