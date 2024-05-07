import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const LibraryPage = () => {
  const PlaylistScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Playlist Content</Text>
    </View>
  );

  const SingerScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Singer Content</Text>
    </View>
  );
  const SongScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Song Content</Text>
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
    { key: "song", title: "Song" },
    { key: "album", title: "Album" },
    { key: "singer", title: "Singer" },
  ]);

  const renderScene = SceneMap({
    playlist: PlaylistScreen,
    song: SongScreen,
    album: AlbumScreen,
    singer: SingerScreen,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#1C1B1B", width: 20 }}
      style={{ backgroundColor: "#1C1B1B", overflowX: "auto" }}
      renderLabel={({ route, focused }) => (
        <Pressable
          style={{
            borderWidth: 1,
            backgroundColor: focused ? "#49A078" : "#1C1B1B",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
            borderColor: "white",
            borderRadius: 20,
            margin: 0,
          }}
        >
          <Text
            style={{
              color: "white",
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
        <Ionicons name="arrow-back-circle-outline" size={24} color="white" />
        <Text style={styles.headerText}>My Library</Text>
        <Feather name="more-vertical" size={24} color="white" />
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
    marginTop: "11.68%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#FFFFFF",
  },
});

export default LibraryPage;
