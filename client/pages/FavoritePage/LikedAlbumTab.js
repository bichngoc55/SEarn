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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlbumItem from "../../components/albumItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbum } from "../../service/albumService";
import { useSelector, useDispatch } from "react-redux";

export default function LikedAlbumTab() {
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
      console.log("Access Token in useEffect album:", accessTokenForSpotify);
      }
  }, [user, accessTokenForSpotify]);
  const [albumList, setAlbumList] = useState([
    "4aawyAB9vmqN3uQ7FjRGTy",
    "382ObEPsp2rxGrnsizN5TX",
  ]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const albumPromises = albumList.map((albumId) =>
            getAlbum(accessTokenForSpotify, albumId)
          );
          const albumData = await Promise.all(albumPromises);
          albumData.forEach((album) => {});
          setAlbums(albumData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching albums hehe:", error);
      }
    };
  
      fetchAlbums();
    }, [accessTokenForSpotify, albumList]);

    return(
    <SafeAreaView style={styles.tabContainer}>
        <View style={styles.sort}>
            <Text style={styles.text}>Sort By</Text>
            <TouchableOpacity style={{flexDirection:"row", alignItems: "center"}}>
              <MaterialCommunityIcons
                name="sort-clock-ascending-outline"
                color={COLOR.btnBackgroundColor}
                size={30}
              />
              <Text style={[styles.text, {marginLeft:5}]}>Recently Added</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.flatlistContainer}>
            <FlatList
            data={albums}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return <AlbumItem input={item} />;
            }}
            />
        </View>
    </SafeAreaView>
)}

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