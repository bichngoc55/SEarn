import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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

import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlbumItem from "../../components/albumItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbum } from "../../service/albumService";
import { useSelector, useDispatch } from "react-redux";

const AlbumDetailScreen = ({ route }) => {
    const { album } = route.params;
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.headerL}>
            <Text style={styles.headerText}>Your liked album</Text>
            <View style={{ width: scale(30), height: scale(30) }} />
          </View>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    tabContainer: {
      flex: 1,
      height: "100%",
    },
    sort: {
      marginVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    text: {
        fontSize: 16,
        color: "white",
    },
    flatlistContainer: {
      marginLeft: "8.48%",
      marginRight: "8.48%",
    },
});

export default AlbumDetailScreen;