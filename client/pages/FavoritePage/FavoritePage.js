import React, { useState } from "react";
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
import { store, persistor } from "../../redux/store";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const LibraryPage = () => {
  const PlaylistScreen = () => (
    <View style={{ flex: 1 }}>
      <PlaylistPage />
    </View>
  );

  const ArtistScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Artist Contents</Text>
    </View>
  );
  const AlbumScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Album Content</Text>
    </View>
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "playlist", title: "Playlist" },
    { key: "album", title: "Album" },
    { key: "artist", title: "Artist" },
  ]);

  const renderScene = SceneMap({
    playlist: PlaylistScreen,
    album: AlbumScreen,
    artist: ArtistScreen,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "transparent" }}
      style={{
        backgroundColor: "#1C1B1B",
        marginHorizontal: 10,
        outline: "none",
        borderWidth: 0,
        borderColor: "#FFFFFF",
      }}
      renderLabel={({ route, focused }) => (
        <Pressable
          style={{
            borderWidth: 1,
            backgroundColor: focused ? "#49A078" : "#1C1B1B",
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            paddingBottom: 5,
            borderColor: focused ? "#49A078" : "white",
            borderRadius: 20,
            margin: 0,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
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
    marginLeft: "8.48%",
    marginRight: "8.48%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8.68%",
    marginBottom: "2.68%",
    flexDirection: "row",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LibraryPage;
