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

const PlayListItem = ({ input }) => {

//   const { user } = useSelector((state) => state.user);

//   const { accessTokenForSpotify } = useSelector(
//     (state) => state.spotifyAccessToken
//   );
//   useEffect(() => {
//     if (accessTokenForSpotify) {
//     console.log("Access Token in useEffect search:", accessTokenForSpotify);
//     }
//   }, [user, accessTokenForSpotify]);

  const navigation = useNavigation();
  const moveToPlaylistDetail = () => {
    navigation.navigate("PlaylistExplore", {
      playlist: input,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={moveToPlaylistDetail}>
      <Image source={{ uri: input.images[0].url }} style={styles.circle} />
      <View style={{ flexDirection: "column", flex: 1, marginHorizontal: scale(10), height: scale(60), justifyContent: "space-between"}}>
        <Text style={styles.textName} numberOfLines={2} ellipsizeMode="tail">
          {input.name}
        </Text>
        <Text style={styles.textArtist}>
          {input.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex:1,
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
    fontSize: scale(14),
    color: "white",
    fontFamily: "semiBold"
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    justifyContent: "flex-end",
    fontFamily:"regular"
  },
});

export default PlayListItem;
