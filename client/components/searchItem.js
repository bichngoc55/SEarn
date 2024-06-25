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

import { useNavigation } from "@react-navigation/native";
import { getAlbum } from "../service/albumService";
import { getTrack } from "../service/songService";
import AudioService from "../service/audioService";

const SearchItem = ({ input , songList}) => {
  const { user } = useSelector((state) => state.user);
  let service = new AudioService();
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  useEffect(() => {
    if (accessTokenForSpotify) {
      //console.log("Access Token in useEffect search:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);

  const navigation = useNavigation();
  const moveToDetail = () => {
    if (input.type === "artist")
      navigation.navigate("ArtistDetail", {
        artist: input,
      });
    else if (input.type === "album") {
      moveToAlbumDetail();
    } else moveToPlaySong();
  };

  const moveToAlbumDetail = async () => {
    try {
      if (accessTokenForSpotify) {
        const albumData = await getAlbum(accessTokenForSpotify, input.id);
        navigation.navigate("AlbumDetail", {
          album: albumData,
        });
      }
    } catch (error) {
      console.error("Error fetching search album hehe:", error);
    }
  };
  const getCurrentSongIndex = () => {
    return songList.findIndex((item) => item.id === input.id);
  };

  const currentSongIndex = getCurrentSongIndex();
  const moveToPlaySong = async () => {
    try {
      if (accessTokenForSpotify) {
        const songData = await getTrack(accessTokenForSpotify, input.id);
        console.log(songData);
        service.currentTime = 0;
        service.currentSong = songData;
        service.currentPlaylist = songList;
        service.currentAudioIndex = currentSongIndex;
        service.playCurrentAudio();
        service.isGetCoin = true;
        navigation.navigate("PlaySong", {
          song: songData,
        });
      } else alert("accessToken: " + accessTokenForSpotify);
    } catch (error) {
      console.error("Error fetching search song hehe:", error);
    }
  };
  let name, image;

  if (input.type === "artist" || input.type === "album") {
    // Đối tượng là nghệ sĩ (artist) hoặc album
    name = input.name;
    image = input.images[0]?.url;
  } else if (input.type === "track") {
    // Đối tượng là bài hát (track)
    name = input.name;
    image = input.album?.image;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={moveToDetail}>
      <Image source={{ uri: image }} style={styles.circle} />
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          marginHorizontal: scale(10),
          height: scale(60),
          justifyContent: "space-evenly",
        }}
      >
        <Text style={styles.textName} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.textArtist}>{input.type}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    padding: scale(10),
    borderRadius: scale(20),
    height: scale(80),
    width: scale(350),
  },
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
    fontFamily: "semiBold",
    fontSize: scale(15),

  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    justifyContent: "flex-end",
    fontFamily: "regular",
  },
});

export default SearchItem;
