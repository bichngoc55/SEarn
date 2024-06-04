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
import PlaySongPage from "../PlaySongPage/PlaySong";
import LyricPage from "../LyricPage/LyricPage";
import { store, persistor } from "../../redux/store";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import scale from "../../constant/responsive";
import { SafeAreaView } from "react-native-safe-area-context";

const PlaySongAndLyricPage = ({ route }) => {
  const { song } = route.params;
  console.log(song.name);
  const PlaySongScreen = () => (
    <View style={{ flex: 1 }}>
      <PlaySongPage song={song} />
    </View>
  );

  const LyricScreen = () => (
    <View style={{ flex: 1 }}>
      <LyricScreen />
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "playsong", title: "Playsong" },
    { key: "lyric", title: "Lyric" },
  ]);

  const renderScene = SceneMap({
    playsong: PlaySongScreen,
    lyric: LyricScreen,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "transparent" }}
      style={{
        display: "block",
      }}
      renderLabel={({ route, focused }) => <Pressable></Pressable>}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
});

export default PlaySongAndLyricPage;
