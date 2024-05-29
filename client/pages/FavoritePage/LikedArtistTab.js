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
import ArtistItem from "../../components/artistItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getArtist } from "../../service/artistService";
import { useSelector, useDispatch } from "react-redux";

export default function LikedArtistTab() {
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
  const [artistList, setArtistList] = useState([
    "1O3ZOjqFLEnbpZexcRjocn",
    "0TnOYISbd1XYRBk9myaseg",
  ]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const artistPromises = artistList.map((artistId) =>
            getArtist(accessTokenForSpotify, artistId)
          );
          const artistData = await Promise.all(artistPromises);
          artistData.forEach((artist) => {});
          setArtists(artistData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching artists hehe:", error);
      }
    };
  
      fetchArtists();
    }, [accessTokenForSpotify, artistList]);

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
            data={artists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return <ArtistItem input={item} />;
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