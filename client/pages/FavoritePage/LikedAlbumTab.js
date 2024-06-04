import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import { COLOR } from "../../constant/color";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlbumItem from "../../components/albumItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getAlbum } from "../../service/albumService";
import { getLikedAlbumList } from "../../service/getLikedAlbumList";
import { useSelector, useDispatch } from "react-redux";
import scale from "../../constant/responsive";

export default function LikedAlbumTab() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (accessTokenForSpotify) {
      console.log("Access Token in useEffect album:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);

  const [albumList, setAlbumList] = useState([]);
  const [albums, setAlbums] = useState([]);
  //get liked album list on db
  useEffect(() => {
    const fetchAlbumList = async () => {
      try {
        if (accessToken) {
          const { listLikedAlbums } = await getLikedAlbumList(
            accessToken,
            user._id
          );
          const albumIds = listLikedAlbums.map((likedAlbum) => likedAlbum.id);
          // const likedAlbumsPromises = [...listLikedAlbums];
          // const likedAlbumData = await Promise.all(likedAlbumsPromises);
          // likedAlbumData.forEach((likedAlbum) => {});
          // setAlbumList(likedAlbumData);
          setAlbumList(albumIds);
        } else alert("Chưa có accessToken");
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbumList();
  }, [user?._id, accessToken]);
  //Get in4 for albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        if (accessTokenForSpotify) {
          const albumPromises = albumList.map((albumId) =>
            getAlbum(accessTokenForSpotify, albumId)
          );
          const albumData = await Promise.all(albumPromises);
          albumData.forEach((album) => {});
          setAlbums(albumData);
        } else alert("accessToken: " + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching liked albums hehe:", error);
      }
    };

    fetchAlbums();
  }, [accessTokenForSpotify, albumList]);

  //add like album to db
  const addToLikedAlbums = async (albumId) => {
    fetch(`http://localhost:3005/auth/${user._id}/addLikedAlbums`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ albumId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike album on db
  const unlikeAlbum = async (albumId) => {
    fetch(`http://localhost:3005/auth/${user._id}/unlikeAlbum`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ albumId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  // Handle like/unlike action
  const handleLikeUnlike = async (albumId) => {
    if (albumList.includes(albumId)) {
      await unlikeAlbum(albumId);
      setAlbumList(albumList.filter((id) => id !== albumId));
    } else {
      await addToLikedAlbums(albumId);
      setAlbumList([...albumList, albumId]);
    }
  };

  return (
    <SafeAreaView style={styles.tabContainer}>
      <View style={styles.sort}>
        <Text style={styles.text}>Sort By</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="sort-clock-ascending-outline"
            color={COLOR.btnBackgroundColor}
            size={30}
          />
          <Text style={[styles.text, { marginLeft: 5 }]}>Recently Added</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flatlistContainer}>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <AlbumItem
                  input={item}
                  onLikeUnlike={handleLikeUnlike}
                  isLiked={albumList.includes(item.id)}
                />
                <Text style={[styles.text, { marginLeft: 5 }]}>
                  Recently Added
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.flatlistContainer}>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <AlbumItem
                input={item}
                onLikeUnlike={handleLikeUnlike}
                isLiked={albumList.includes(item.id)}
              />
            );
          }}
          ListFooterComponent={<View style={{ height: scale(60) }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    height: "100%",
  },
  sort: {
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});
