import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";

const LaunchingPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.spotifyAccessToken.accessToken
  );
  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, LaunchingPage!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default LaunchingPage;
