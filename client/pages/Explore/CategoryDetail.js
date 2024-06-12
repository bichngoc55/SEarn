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
import { getCategorysPlaylists } from "../../service/categorysPlaylists";
import { useSelector, useDispatch } from "react-redux";
import PlayListItem from "../../components/playlistItem";

const CategoryDetailScreen = ({ route }) => {
  const { category } = route.params;
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

      console.log("Access Token in useEffect playlist:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);
  const [categoryPlaylists, setCategoryPlaylists] = useState([]);

  useEffect(() => {
    const fetchCategoryPlaylists = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const { items } = await getCategorysPlaylists(accessTokenForSpotify, category.id);
          const categoryPlaylistsPromises = [...items];
          const categoryPlaylistsData = await Promise.all(categoryPlaylistsPromises);
          categoryPlaylistsData.forEach((categoryPlaylist) => {});
          setCategoryPlaylists(categoryPlaylistsData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching category playlists hehe:", error);
      }
    };
    fetchCategoryPlaylists();
  }, [accessTokenForSpotify, category.id]);

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.img_and_backBtn}>
        <Image source={{ uri: category.icons[0].url }}
        style={styles.categoryImg}
        resizeMode="cover"/>
        <View style={styles.backButtonContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
          </Pressable>
        </View>
      </View>
    <Text style={styles.categoryName}>{category.name}</Text> 
    <View style={styles.content}>
      <View style={styles.flatlistContainer}>
        <FlatList
          data={categoryPlaylists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <PlayListItem input={item} />;
          }}
          nestedScrollEnabled={true}
        />
      </View>
    </View>
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
    height: scale(300),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  categoryImg: {
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
    borderRadius:scale(100),
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  categoryName: {
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

export default CategoryDetailScreen;
