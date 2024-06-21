import React, { useState, useEffect, useCallback} from "react";
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
import { useFocusEffect } from "@react-navigation/native";

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

  // useEffect(() => {
  //   dispatch(fetchSpotifyAccessToken());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (accessTokenForSpotify) {
  //     //console.log("Access Token in useEffect album:", accessTokenForSpotify);
  //   }
  // }, [user, accessTokenForSpotify]);

  const [albumList, setAlbumList] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [sortOrder, setSortOrder] = useState(0);

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder + 1) % 3);
  };

  //get liked album list on db
  const [isFetching, setIsFetching] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAlbumList = async () => {
        if (!accessToken) return;

        try {
          setIsFetching(true);
          const { listLikedAlbums } = await getLikedAlbumList(accessToken, user?._id);
          if (isActive) {
            setAlbumList(listLikedAlbums);
          }
        } catch (error) {
          console.error("Error fetching albums:", error);
          // Có thể thêm xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi
        } finally {
          if (isActive) {
            setIsFetching(false);
          }
        }
      };

      fetchAlbumList();

      return () => {
        isActive = false;
      };
    }, [user?._id, accessToken])
  );

  //Get in4 for albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        if (accessTokenForSpotify) {
          const albumPromises = albumList.map((likedAlbum) =>
            getAlbum(accessTokenForSpotify, likedAlbum.id).then((album) => ({
              ...album,
              timeAdded: likedAlbum.timeAdded,
            }))
          );
          const albumData = await Promise.all(albumPromises);
          albumData.forEach((album) => {});
          setAlbums(albumData);
        } else alert("accessToken: " + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching liked albums hehe:", error);
      }
    };

    if (accessTokenForSpotify) {
      fetchAlbums();
    }
  }, [accessTokenForSpotify, albumList]);

  // Sort albums based on sortOrder
  useEffect(() => {
    const sortAlbums = () => {
      let sortedAlbums = [...albums];
      switch (sortOrder) {
        case 0:
          sortedAlbums = sortedAlbums.sort(() => Math.random() - 0.5);
          break;
        case 1:
          sortedAlbums.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 2:
          sortedAlbums.sort(
            (a, b) => new Date(b.timeAdded) - new Date(a.timeAdded)
          );
          break;
        default:
          break;
      }
      setAlbums(sortedAlbums);
    };

    sortAlbums();
  }, [sortOrder]);

  //add like album to db
  const addToLikedAlbums = async (albumId) => {
    fetch(`http://localhost:3005/auth/${user._id}/addLikedAlbums`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ albumId }),
    });
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
    const album = albumList.find((a) => a.id === albumId);
    if (album) {
      await unlikeAlbum(albumId);
      setAlbumList(albumList.filter((a) => a.id !== albumId));
      setAlbums(albums.filter((a) => a.id !== albumId));
    } else {
      await addToLikedAlbums(albumId);
      const timeAdded = new Date().toISOString();
      setAlbumList([...albumList, { id: albumId, timeAdded }]);
      const newAlbum = { id: albumId, timeAdded };
      // Cập nhật `albumList` và `albums`
      setAlbumList([...albumList, newAlbum]);
      // Fetch lại thông tin nghệ sĩ từ Spotify và cập nhật `albums`
      const albumData = await getAlbum(accessTokenForSpotify, albumId);
      setAlbums([...albums, { ...albumData, timeAdded }]);
    }
  };

  return (
    <SafeAreaView style={styles.tabContainer}>
      <View style={styles.sort}>
        <Text style={styles.text}>Sort By</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={handleSort}
        >
          <MaterialCommunityIcons
            name="sort-clock-ascending-outline"
            color={COLOR.btnBackgroundColor}
            size={30}
          />
          <Text style={[styles.text, { marginLeft: 5 }]}>
            {sortOrder === 0
              ? "Random"
              : sortOrder === 1
              ? "Sort by Name"
              : "Recently Added"}
          </Text>
        </TouchableOpacity>
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
                isLiked={albumList.some((a) => a.id === item.id)}
              />
            );
          }}
          ListFooterComponent={<View style={{ height: scale(120) }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    height: "100%",
    marginHorizontal: scale(10),
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
    fontFamily: "semiBold",
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});
