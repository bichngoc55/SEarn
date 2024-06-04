import React, { useState } from "react";import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";

import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import NewsTab from "./NewTabScreen";
import RelatedArtist from "./RelatedArtists";

const HomePage = () => {
  const NewsTabScreen = () => (
    <View style={{ flex: 1 }}>
      <NewsTab />
    </View>
  );
  
  const RelatedArtistScreen = () => (
    <View style={{ flex: 1}}>
      <RelatedArtist/>
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "news", title: "News" },
    { key: "artist", title: "Artist" },
  ]);

  const renderScene = SceneMap({
    news: NewsTabScreen,
    artist: RelatedArtistScreen,
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
      <View style={styles.recentSongContainer}>
        <View style={{flexDirection: "column", marginHorizontal:scale(10),}}>
          <Text>
            Hello
          </Text>
        </View>
        <View style={styles.circle}>
        </View>
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
  recentSongContainer: {
    width:"100%",
    height: scale(200),
    backgroundColor: "grey",
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    paddingHorizontal:scale(10),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20)

  },
  circle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(100),
    marginHorizontal:scale(10),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
