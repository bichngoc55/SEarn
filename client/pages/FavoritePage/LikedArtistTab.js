import React, { useState, useEffect, useCallback } from "react";
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
import ArtistItem from "../../components/artistItem";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getArtist } from "../../service/artistService";
import { getLikedArtistList } from "../../service/getLikedArtistList";
import { useSelector, useDispatch } from "react-redux";
import scale from "../../constant/responsive";

export default function LikedArtistTab() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const{accessToken}   = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector((state) => state.spotifyAccessToken);
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  // useEffect(() => {
  //   if (accessTokenForSpotify) {
  //     //console.log("Access Token in useEffect artist:", accessTokenForSpotify);
  //   }
  // }, [user, accessTokenForSpotify]);
  
  const [artistList, setArtistList] = useState([]);
  const [artists, setArtists] = useState([]);
  const [sortOrder, setSortOrder] = useState(0);

  //get liked artist list on db
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const fetchArtistList = async () => {
        if (!accessToken) return;
  
        try {
          setIsFetching(true);
          const { listLikedArtists } = await getLikedArtistList(
            accessToken,
            user?._id
          );
          if (isActive) {
            setArtistList(listLikedArtists);
          }
        } catch (error) {
          console.error("Error fetching artists:", error);
          // Có thể thêm xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi
        } finally {
          if (isActive) {
            setIsFetching(false);
          }
        }
      };
  
      fetchArtistList();
  
      return () => {
        isActive = false;
      };
    }, [user?._id, accessToken])
  );

  //get in4 of artist from Spotify
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const artistPromises = artistList.map((likedArtist) =>
            getArtist(accessTokenForSpotify, likedArtist.id).then((artist) => ({
              ...artist,
              timeAdded: likedArtist.timeAdded,
            }))
          );
          const artistData = await Promise.all(artistPromises);
          artistData.forEach((artist) => {});
          setArtists(artistData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching artists hehe:", error);
      }
    };

    fetchArtists();
  }, [accessTokenForSpotify, artistList]);

  // Sort artists based on sortOrder
  useEffect(() => {
    const sortArtists = () => {
      let sortedArtists = [...artists];
      switch (sortOrder) {
        case 0:
          sortedArtists = sortedArtists.sort(() => Math.random() - 0.5);
          break;
        case 1:
          sortedArtists.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 2:
          sortedArtists.sort(
            (a, b) => new Date(b.timeAdded) - new Date(a.timeAdded)
          );
          break;
        default:
          break;
      }
      setArtists(sortedArtists);
    };

    sortArtists();
  }, [sortOrder]);
  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder + 1) % 3);
  };

  //add like artist to db
  const addToLikedArtists = async (artistId) => {
    fetch(`http://localhost:3005/auth/${user._id}/addLikedArtists`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ artistId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike artist on db
  const unlikeArtist = async (artistId) => {
    fetch(`http://localhost:3005/auth/${user._id}/unlikeArtists`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ artistId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  // Handle like/unlike action
  const handleLikeUnlike = async (artistId) => {
    // Tìm nghệ sĩ trong danh sách `artistList`
    const artist = artistList.find((a) => a.id === artistId);
    if (artist) {
      // Nếu nghệ sĩ đã được yêu thích, thực hiện hành động `unlike`
      await unlikeArtist(artistId);
      // Cập nhật `artistList` và `artists`
      setArtistList(artistList.filter((a) => a.id !== artistId));
      setArtists(artists.filter((a) => a.id !== artistId));
    } else {
      // Nếu nghệ sĩ chưa được yêu thích, thực hiện hành động `like`
      await addToLikedArtists(artistId);
      const timeAdded = new Date().toISOString();
      const newArtist = { id: artistId, timeAdded };
      // Cập nhật `artistList` và `artists`
      setArtistList([...artistList, newArtist]);
      // Fetch lại thông tin nghệ sĩ từ Spotify và cập nhật `artists`
      const artistData = await getArtist(accessTokenForSpotify, artistId);
      setArtists([...artists, { ...artistData, timeAdded }]);
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
          data={artists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ArtistItem
                input={item}
                onLikeUnlike={handleLikeUnlike}
                isLiked={artistList.some((a) => a.id === item.id)}
              />
            );
          }}
          ListFooterComponent={<View style={{ height: scale(190) }} />}
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
