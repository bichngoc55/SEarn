import React, { useState, useEffect } from "react";
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
import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { useSelector, useDispatch } from "react-redux";
import {  GestureHandlerRootView  } from "react-native-gesture-handler";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbumsNewReleases } from "../../service/albumsNewReleases";
import { getTracksRecommendations } from "../../service/songsRecommendations";
import ArtistAlbumItem from "../../components/artistAlbumItem";
import SongItem from "../../components/songItem";
export default function NewsTab() {
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

  // useEffect(() => {
  //   if (accessTokenForSpotify) { 
  //   console.log("Access Token in useEffect artist:", accessTokenForSpotify);
  //   }
  // }, [user, accessTokenForSpotify]);
  const [albumsNewReleases, setAlbumsNewReleases] = useState([]);
  const [tracksRecommendations, setTracksRecommendations] = useState([]);

  useEffect(() => {
    const fetchAlbumsNewReleases = async () => {
      try {
        console.log("Gọi in4 Home từ spotify");
        console.log(accessTokenForSpotify)
        if (accessTokenForSpotify) {
          const { items } = await getAlbumsNewReleases(accessTokenForSpotify);
          const albumsPromises = [...items];
          const newAlbumsData = await Promise.all(albumsPromises);
          newAlbumsData.forEach((newAlbum) => {});
          setAlbumsNewReleases(newAlbumsData);

          const { items: trackItems } = await getTracksRecommendations(accessTokenForSpotify);
          const tracksPromises = trackItems.map((item) => item.track);
          const tracksData = await Promise.all(tracksPromises);
          tracksData.forEach((trackRecommendation) => {});
          setTracksRecommendations(tracksData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching tracks recommendations hehe:", error);
      }
    };
    fetchAlbumsNewReleases();
    }, [accessTokenForSpotify]);
  
    return(
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.content}>
        <FlatList style={styles.flatlistContainer}
          data={tracksRecommendations}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Albums</Text>
              <View style={styles.flatlistContainer}>
                <FlatList
                  horizontal={true}
                  data={albumsNewReleases}
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
            return <SongItem input={item} songList={tracksRecommendations}/>;
          }}
          nestedScrollEnabled={true}
          ListFooterComponent={<View style={{ height: scale(60) }} />}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  content:{
    marginHorizontal: scale(10),
    flex:1,
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
})
