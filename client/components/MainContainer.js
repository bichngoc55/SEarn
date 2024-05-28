import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Import createNativeStackNavigator
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomePage from "../pages/HomePage/HomePage";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import LibraryPage from "../pages/FavoritePage/FavoritePage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserPage from "../pages/userProfilePage/userProfilePage";
import gettingStartedPage from "../pages/GettingStartedPage/gettingStartedPage";
import LoginPage from "../pages/LoginPage/loginPage";
import RegisterPage from "../pages/RegisterPage/registerPage";
import PlaylistPage from "../pages/FavoritePage/PlaylistPage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import AlbumDetailScreen from "../pages/AlbumDetailScreen/AlbumDetailScreen";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import SignUpOrLoginPage from "../pages/SignUpOrLogin/signUpOrLogin";
import ExploreScreen from "../pages/ExploreScreen/ExploreScreen";
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const homeName = "Home";
const userName = "User";
const exploreName = "Explore";
const libraryName = "Library";

const theme = {
  colors: {
    primaryContainer: "#737373",
    secondaryContainer: "transparent",
  },
};
function FavouriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favourite" component={FavoritePage} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen}/>
      {/* <Stack.Screen name="Playlist" component={PlaylistPage} /> */}
    </Stack.Navigator>
  );
}

// function ArtistStack() {
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name={ArtistDetail} component={ArtistDetailPage} />
//     <Stack.Screen name={LikedArtist} component={ArtistDetailPage} />
//   </Stack.Navigator>;
// }

// function AlbumStack() {
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name={Album} component={AlbumPage} />
//     <Stack.Screen name={LikedAlbum} component={AlbumPage} />
//   </Stack.Navigator>;
// }
function UserStack() {
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={User} component={UserPage} />

    {/* <Stack.Screen name={ChangePassword} component={ChangePasswordPage} />
    <Stack.Screen
      name={TermsAndConditions}
      component={TermsAndConditionsPage}
    />
    <Stack.Screen name={PrivacyPolicy} component={PrivacyPolicyPage} /> */}
  </Stack.Navigator>;
}

function BottomBar() {
  return (
    <View style={styles.tabContainer}>
      <Tab.Navigator
        initialRouteName={homeName}
        activeColor="#FED215"
        inactiveColor="#979797"
        barStyle={{
          backgroundColor: "#737373",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          position: "absolute",
          overflow: "hidden",
          alignContent: "center",
          justifyContent: "center",
        }}
        shifting={true}
      >
        <Tab.Screen
          name={homeName}
          component={HomePage}
          options={{
            tabBarLabel: <Text style={styles.tabBarLabel}>Home</Text>,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name={exploreName}
          component={ExploreScreen}
          options={{
            tabBarLabel: <Text style={styles.tabBarLabel}>Explore</Text>,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "file-find" : "file-find-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Favourite"
          component={FavouriteStack}
          options={{
            tabBarLabel: <Text style={styles.tabBarLabel}>Favorite</Text>,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? "favorite" : "favorite-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name={userName}
          component={UserPage}
          options={{
            tabBarLabel: <Text style={styles.tabBarLabel}>User</Text>,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default function MainNavigation() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Launching" component={launchingPage} />
            <Stack.Screen
              name="GettingStarted"
              component={gettingStartedPage}
            />
            <Stack.Screen name="SignUpOrLogin" component={SignUpOrLoginPage} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen name="BottomBar" component={BottomBar} />
          </>
        ) : (
          <Stack.Screen name="BottomBar" component={BottomBar} />
        )}
      </Stack.Navigator>
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
