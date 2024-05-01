import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomePage from "../pages/HomePage/HomePage";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import UserPage from "../pages/userProfilePage/userProfilePage";

const homeName = "Home";
const userName = "User";
const launchingName = "Launching";
const libraryName = "Library";
const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const getTabScreenOptions = ({ route }) => ({
    tabBarActiveTintColor: "#49A078",
    tabBarLabelStyle: { fontSize: 12 },
    tabBarStyle: {
      backgroundColor: "#737373",
      height: 50,
    },
    tabBarItemStyle: {
      backgroundColor: "#737373",
      height: 50,
    },
  });
  return (
    <NavigationContainer>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;
              if (rn === homeName) {
                iconName = focused ? "home" : "home-outline";
              } else if (rn === launchingName) {
                iconName = focused ? "file-find" : "file-find-outline";
              } else if (rn === libraryName) {
                iconName = focused ? "library" : "library-outline";
              } else if (rn === userName) {
                iconName = focused ? "person" : "person-outline";
              }

              if (
                iconName === "file-find" ||
                iconName === "file-find-outline"
              ) {
                return (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={size}
                    color={color}
                  />
                );
              } else {
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: "#49A078",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: {
              backgroundColor: "#737373",
              height: 60,
              paddingTop: 5,
            },
            tabBarItemStyle: {
              height: 50,
            },
          })}
        >
          <Tab.Screen name={homeName} component={HomePage} />
          <Tab.Screen name={launchingName} component={launchingPage} />
          <Tab.Screen name={libraryName} component={LibraryPage} />
          <Tab.Screen name={userName} component={UserPage} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
});
