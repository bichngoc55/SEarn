import { useSelector, useDispatch } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
const LaunchingPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.spotifyAccessToken.accessToken
  );
  const loading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);
  return (
    <View style={styles.container}>
      {loading && <Text>Loading access token...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {accessToken && (
        <Text style={styles.text}>
          Hello, LaunchingPage! This is {accessToken}
        </Text>
      )}
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
