import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const LibraryPage = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerL}>
          <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
          <Text style={styles.headerText}>My Library</Text>
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
    fontFamily: "Monserrat",
  },
  scrollView: {
    flex: 1,
  },
  headerL: {
    marginLeft: "8.48%",
    marginRight: "8.48%",
    height: 35,
    marginTop: "11.68%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default LibraryPage;
