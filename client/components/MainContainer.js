import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabView,
} from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Import createNativeStackNavigator
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomePage from "../pages/HomePage/HomeScreen";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserPage from "../pages/userProfilePage/userProfilePage";
import gettingStartedPage from "../pages/GettingStartedPage/gettingStartedPage";
import LoginPage from "../pages/LoginPage/loginPage";
import RegisterPage from "../pages/RegisterPage/registerPage";
import PlaylistPage from "../pages/FavoritePage/PlaylistPage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import LikedSongPage from "../pages/FavoritePage/LikedSongPage";
import AlbumDetailScreen from "../pages/AlbumDetailScreen/AlbumDetailScreen";
import ArtistDetailScreen from "../pages/ArtistDetailScreen/ArtistDetailScreen";
import { useSelector, useDispatch } from "react-redux";
import PlaySongPage from "../pages/PlaySongPage/PlaySong";
import { setUser } from "../redux/userSlice";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage/termsAndConditionPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage/privacyPolicyPage";
import SignUpOrLoginPage from "../pages/SignUpOrLogin/signUpOrLogin";
import PasswordChangePage from "../pages/PasswordChangePage/passwordChangePage";
import { Dimensions } from "react-native";
import LyricPage from "../pages/LyricPage/Lyricpage";
import PlaylistDetailMongo from "../pages/PlaylistDetailMongo/PlaylistDetailMongo";
import ExploreScreen from "../pages/Explore/ExploreScreen";
import CategoryDetailScreen from "../pages/Explore/CategoryDetail";
import PlaylistDetailScreen from "../pages/Explore/PlaylistDetailScreen";
import LikedArtistTab from "../pages/FavoritePage/LikedArtistTab";
import AddtoPlaylist from "./MenuOfPlaysong/AddToPlaylist";
import LikedAlbumTab from "../pages/FavoritePage/LikedAlbumTab";
import PublicPlaylist from "../pages/PublicPlaylist/publicPlaylist";
import MiniPlayer from "./miniPlayer";
import scale from "../constant/responsive";
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const { height } = Dimensions.get("window");
const homeName = "Home";
const userName = "User";
const exploreName = "Explore";

const theme = {
  colors: {
    primaryContainer: "transparent",
    secondaryContainer: "transparent",
  },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen
        name="PlaySong"
        component={PlaySongPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddTo"
        component={AddtoPlaylist}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <Stack.Screen name="PlaylistExplore" component={PlaylistDetailScreen} />
      <Stack.Screen
        name="PlaySong"
        component={PlaySongPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Lyric"
        component={LyricPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="PlaylistDetailMongo"
        component={PlaylistDetailMongo}
      />
    </Stack.Navigator>
  );
}

function FavouriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favourite" component={FavoritePage} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen name="LikedSong" component={LikedSongPage} />
      <Stack.Screen
        name="PlaySong"
        component={PlaySongPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddTo"
        component={AddtoPlaylist}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Lyric"
        component={LyricPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="PlaylistDetailMongo"
        component={PlaylistDetailMongo}
      />
    </Stack.Navigator>
  );
}
function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserPage} />
      <Stack.Screen name="ChangePassword" component={PasswordChangePage} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsPage}
      />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyPage} />
      <Stack.Screen name="publicPlaylist" component={PublicPlaylist} />
    </Stack.Navigator>
  );
}

function FavoriteTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Playlist" component={PlaylistPage} />
      <Tab.Screen name="LikedArtistTab" component={LikedArtistTab} />
      <Tab.Screen name="LikedAlbumTab" component={LikedAlbumTab} />
    </Tab.Navigator>
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

function BottomBar() {
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName={homeName}
          activeColor="#FED215"
          inactiveColor="#979797"
          barStyle={{
            backgroundColor: "rgba(30, 30, 30, 0.75)",
            borderTopLeftRadius: scale(15),
            borderTopRightRadius: scale(15),
            height: scale(60),
            position: "absolute",
            overflow: "hidden",
            alignContent: "center",
            justifyContent: "center",
            shadowColor: "red",
            shadowOpacity: 0.4,
            shadowRadius: 12,
            shadowOffset: {
              width: 5,
              height: 3,
            },
          }}
          shifting={true}
        >
          <Tab.Screen
            backgroundColor="white"
            name={homeName}
            component={HomeStack}
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
            component={ExploreStack}
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
            component={UserStack}
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
      <View style={styles.miniPlayer}>
        <MiniPlayer />
      </View>
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
            <Stack.Screen name="Miniplayer" component={MiniPlayer} />
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
    zIndex: 1,
    bottom: 0,
  },
  tabBarLabel: {
    fontSize: 15,
  },
  miniPlayer: {
    zIndex: 2,
    position: "absolute",
    bottom: scale(60),
    left: 0,
    right: 0,
  },
});

