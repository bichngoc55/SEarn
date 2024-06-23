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
import { useFocusEffect } from "@react-navigation/native";

import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import NewsTab from "./NewTabScreen";
import RelatedArtist from "./RelatedArtists";
import PublicPlaylist from "./PublicPlaylist";
import { useNavigation } from "@react-navigation/native";
import AudioService from "../../service/audioService";
import { getTrack } from "../../service/songService";

const HomePage = () => {
  const navigation = useNavigation();
  const fetchData = useCallback(() => {
    // Logic to fetch data or perform any action when the screen is focused
    console.log("HomePage is focused");
  }, []);

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchSpotifyAccessToken());
      fetchData();
    }, [fetchData])
  );

  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );

  const [recentlyPlayingSong, setRecentlyPlayingSong] = useState();
  const [playSong, setPlaySong] = useState();
  let service = new AudioService();

  const MoveToPlaySong = async () => {
    //service.loadSong();
    if (service.currentSong != null) {
      navigation.navigate("PlaySong", {
        song: service.currentSong,
      });
    } else if (recentlyPlayingSong != null) {
      service.currentTime = 0;
      service.currentSong = recentlyPlayingSong;
      service.playCurrentAudio();
      service.isGetCoin = true;
      navigation.navigate("PlaySong", {
        song: service.currentSong,
      });
    } else alert("No audio available");
  };

  //get in4 recentlySong from spotify
  useEffect(() => {
    const fetchRecentlyPlayingSong = async () => {
      try {
        if (accessTokenForSpotify) {
          const song = await getTrack(
            accessTokenForSpotify,
            user?.recentListeningSong
          );
          setRecentlyPlayingSong(song);
          console.log("Get song from db: " + song.name);
        } else alert("Chưa có accessTokenForSpotify");
      } catch (error) {
        console.error(
          "Error fetching recently playing song in HomeScreen:",
          error
        );
      }
    };
    if (accessTokenForSpotify && user?._id && user?.recentListeningSong) {
      fetchRecentlyPlayingSong();
    }
  }, [user?._id, accessTokenForSpotify, user?.recentListeningSong]);

  //update recentlySong
  const updateRecentlyPlayingSong = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user?._id}/updateRecentListeningSong`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const newRecentlyPlayingSong = async () => {
      try {
        if (accessTokenForSpotify) {
          if (
            recentlyPlayingSong?.id !== service?.currentSong?.id &&
            service.currentSong
          ) {
            updateRecentlyPlayingSong(service.currentSong.id);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching recently playing song in HomeScreen:",
          error
        );
      }
    };
    if (
      accessTokenForSpotify &&
      recentlyPlayingSong !== service.currentSong &&
      user?.recentListeningSong
    ) {
      newRecentlyPlayingSong();
    }
  }, [user?._id, accessTokenForSpotify, service?.currentSong]);

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
      <View style={styles.recentSongContainer}>
        {recentlyPlayingSong ? (
          <>
            <View
              style={{ flexDirection: "column", marginHorizontal: scale(10) }}
            >
              <Text style={styles.songName}>{recentlyPlayingSong?.name}</Text>
              <Text style={styles.artistsName}>
                {recentlyPlayingSong?.artists
                  .map((artist) => artist.name)
                  .join(", ")}{" "}
              </Text>
            </View>
            <TouchableOpacity onPress={MoveToPlaySong}>
              <Image
                source={{ uri: recentlyPlayingSong?.album?.image }}
                style={styles.circle}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: "column",
                marginHorizontal: scale(10),
                width: scale(170),
              }}
            >
              <Text style={styles.artistsName}>
                Chưa có bài hát nào được phát gần đây
              </Text>
            </View>
            <View style={styles.circle} />
          </>
        )}
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
