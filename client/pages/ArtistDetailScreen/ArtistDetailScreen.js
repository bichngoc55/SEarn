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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ArtistItem from "../../components/artistItem";
import LikedArtistTab from "../FavoritePage/LikedArtistTab";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getArtist } from "../../service/artistService";
import { useSelector, useDispatch } from "react-redux";

const ArtistDetailScreen = ({ route }) => {
    const { artist } = route.params;
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.Container}>
            <View style={styles.backButtonContainer}>
                <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate("Favourite")}>
                <Ionicons name="chevron-back-sharp" size={24} color="black" />
                </Pressable>
            </View>
          <View style={styles.headerL}>
            <Text style={styles.headerText}>Your Artist Detail Screen</Text>
            <View style={{ width: scale(30), height: scale(30) }} />
          </View>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: "#121212",

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
});

export default ArtistDetailScreen;