import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import PlaylistPage from "./PlaylistPage";
import LikedAlbumTab from "./LikedAlbumTab";
import LikedArtistTab from "./LikedArtistTab";
import { store, persistor } from "../../redux/store";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import {useDispatch } from "react-redux";
import scale from "../../constant/responsive";

const LibraryPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(fetchSpotifyAccessToken());
  })
  const PlaylistScreen = () => (
    <View style={{ flex: 1 }}>
      <PlaylistPage />
    </View>
  );

  const AlbumScreen = () => (
    <View style={{ flex: 1 }}>
      <LikedAlbumTab />
    </View>
  );

  const ArtistScreen = () => (
    <View style={{ flex: 1 }}>
      <LikedArtistTab />
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "playlist", title: "Playlist" },
    { key: "artist", title: "Artist" },
    { key: "album", title: "Album" },
  ]);

  const renderScene = SceneMap({
    playlist: PlaylistScreen,
    artist: ArtistScreen,
    album: AlbumScreen,
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
        borderColor: "#FFFFFF",
      }}
      renderLabel={({ route, focused }) => (
        <Pressable
          style={{
            borderWidth: 1,
            backgroundColor: focused ? "#FED215" : "#1C1B1B",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderColor: focused ? "#FED215" : "white",
            borderRadius: scale(15),
            margin: 0,
          }}
        >
          <Text
            style={{
              color: "white",
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

      <View style={styles.headerL}>
        <Text style={styles.headerText}>My Library</Text>
      </View>
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
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  scrollView: {
    flex: 1,
  },
  headerL: {
    height: scale(30),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(30),
    marginBottom: scale(10),
    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: scale(20),
    fontFamily: "bold",
  },
});

export default LibraryPage;
