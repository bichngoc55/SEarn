import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { TabBar } from "react-native-tab-view";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView style={styles.scrollView}></ScrollView>
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
});

export default HomePage;
