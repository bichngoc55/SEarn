import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";

import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useSelector, dispatch, useDispatch  } from "react-redux";
import NewsTab from "./NewTabScreen";
import RelatedArtist from "./RelatedArtists";
import PublicPlaylist from "./PublicPlaylist";
import AudioService from "../../service/audioService";
import { getTrack } from "../../service/songService";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import RecentlyPlayingSong from "../../components/recentPlayingSong";
import RecentlyPlayingContainer from '../../components/RecentlyPlayingContainer'
const HomePage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  // const fetchData = useCallback(() => {
  //   // Logic to fetch data or perform any action when the screen is focused
  //   console.log('HomePage is focused');
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(fetchSpotifyAccessToken());
  //     //fetchData();
  //   }, [fetchData])
  // );

  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );

  const [recentlyPlayingSong, setRecentlyPlayingSong] = useState();
  const [playSong, setPlaySong] = useState();
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const MemoizedRecentlyPlayingContainer = React.memo(RecentlyPlayingContainer);
  const NewsTabScreen = () => (
    <View style={{ flex: 1 }}>
      <NewsTab />
    </View>
  );

  const RelatedArtistScreen = () => (
    <View style={{ flex: 1 }}>
      <RelatedArtist />
    </View>
  );

  const PublicPlaylistScreen = () => (
    <View style={{ flex: 1 }}>
      <PublicPlaylist />
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "news", title: "News" },
    { key: "artist", title: "Artist" },
    { key: "playlist", title: "Playlist" },
  ]);

  const renderScene = SceneMap({
    news: NewsTabScreen,
    artist: RelatedArtistScreen,
    playlist: PublicPlaylistScreen,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "transparent" }}
      style={{
        backgroundColor: "#1C1B1B",
        marginHorizontal: scale(10),
        outline: "none",
        borderWidth: 0,
      }}
      renderLabel={({ route, focused }) => (
        <Pressable
          style={{
            borderBottomWidth: 2,
            // backgroundColor: focused ? "#FED215" : "#1C1B1B",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderColor: focused ? "#FED215" : "white",
            borderRadius: scale(15),
            margin: 0,
          }}
        >
          <Text
            style={{
              color: focused ? "#FED215" : "white",
              fontSize: scale(15),
            }}
          >
            {route.title}
          </Text>
        </Pressable>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* <RecentlyPlayingSong/> */}
      <RecentlyPlayingContainer />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1B",
  },
  recentSongContainer: {
    width: "100%",
    height: scale(200),
    backgroundColor: "rgba(35, 35, 35, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    borderColor: COLOR.btnBackgroundColor,
    borderBottomWidth: 1,
  },
  circle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(100),
    marginHorizontal: scale(10),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  songName: {
    fontSize: scale(17),
    fontFamily: "semiBold",
    color: COLOR.btnBackgroundColor,
    marginBottom: scale(5),
  },
  artistsName: {
    fontSize: scale(15),
    fontFamily: "regular",
    color: "white",
  },
});

export default HomePage;
