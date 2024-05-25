import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomePage from "../pages/HomePage/HomePage";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import LibraryPage from "../pages/FavoritePage/FavoritePage";
import UserPage from "../pages/userProfilePage/userProfilePage";

const homeName = "Home";
const userName = "User";
const launchingName = "Launching";
const libraryName = "Library";
const Tab = createMaterialBottomTabNavigator();
const theme = {
  colors: {
    primaryContainer: '#737373',
    secondaryContainer: 'transparent',
  },
};


export default function MainContainer() {
  return (
    <NavigationContainer theme={theme} >
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName={homeName}
          activeColor="#FED215"
          inactiveColor="#979797"
          barStyle= {{
            backgroundColor: "#737373",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 80,
            position: 'absolute',
            overflow: 'hidden',
            alignContent: "center",
            justifyContent: "center",
          }}
          shifting={true}
        >
        
          <Tab.Screen name={homeName} component={HomePage} 
            options={{
              tabBarLabel:  <Text style={styles.tabBarLabel}>Home</Text>,
              tabBarIcon: ({ color, focused, }) => (
                <Ionicons name={focused ? "home" : "home-outline"} color={color} size={30}/>
              ),
            }}
          />
          <Tab.Screen name={launchingName} component={launchingPage} 
            options={{
              tabBarLabel: <Text style={styles.tabBarLabel}>Explore</Text>,
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons name={focused ? "file-find" : "file-find-outline"} color={color} size={30} />
              ),
              
            }}/>
          <Tab.Screen name={libraryName} component={LibraryPage} 
            options={{
              tabBarLabel: <Text style={styles.tabBarLabel}>Favorite</Text>,
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name={focused ? "favorite" : "favorite-outline"} color={color} size={30} />
              ),
            }}/>
          <Tab.Screen name={userName} component={UserPage} 
            options={{
              tabBarLabel: <Text style={styles.tabBarLabel}>User</Text>,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "person" : "person-outline"} color={color} size={30} />
              )
            }}/>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tabBarLabel: {
    fontSize: 15,
  },
});
