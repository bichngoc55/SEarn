import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomePage from "../pages/HomePage/HomePage";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import userPage from "../pages/userProfilePage/userProfilePage";

const homeName = "Home";
const userName = "User";
const launchingName = "Launching";
const libraryName = "Library";
const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;
            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === launchingName) {
              iconName = focused ? "find" : "find-outline";
            } else if (rn === libraryName) {
              iconName = focused ? "library" : "library-outline";
            } else if (rn === userName) {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={homeName} component={HomePage} />
        <Tab.Screen name={launchingName} component={launchingPage} />
        <Tab.Screen name={libraryName} component={LibraryPage} />
        <Tab.Screen name={userName} component={userPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
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
