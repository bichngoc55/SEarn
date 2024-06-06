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
      console.log("Access Token in useEffect artist:", accessTokenForSpotify);
    }
  }, [user, accessTokenForSpotify]);
  const [artistList, setArtistList] = useState([]);
  const [artists, setArtists] = useState([]);

  //get liked artist list on db
  useEffect(() => {
    const fetchArtistList = async () => {
      try {
        if (accessToken) {
          const { listLikedArtists } = await getLikedArtistList(
            accessToken,
            user._id
          );
          const artistIds = listLikedArtists.map(
            (likedArtist) => likedArtist.id
          );
          // const likedArtistsPromises = [...listLikedArtists];
          // const likedArtistData = await Promise.all(likedArtistsPromises);
          // likedArtistData.forEach((likedArtist) => {});
          // setArtistList(likedArtistData);
          setArtistList(artistIds);
        } else alert("Chưa có accessToken");
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    if (!artistList.length && accessToken && user?._id) {
      fetchArtistList();
    }
  }, [user?._id, accessToken]);

  //get in4 of artist from Spotify
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        console.log("calling accesstoken: " + accessTokenForSpotify);
        if (accessTokenForSpotify) {
          const artistPromises = artistList.map((artistId) =>
            getArtist(accessTokenForSpotify, artistId)
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

  //add like artist to db
  const addToLikedArtists = async (artistId) => {
    fetch(
      `https://0452-2405-4802-a632-dc60-6480-d96f-a630-5850.ngrok-free.app/auth/${user._id}/addLikedArtists`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ artistId }),
      }
    )
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  //unlike artist on db
  const unlikeArtist = async (artistId) => {
    fetch(
      `https://0452-2405-4802-a632-dc60-6480-d96f-a630-5850.ngrok-free.app/auth/${user._id}/unlikeArtists`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ artistId }),
      }
    )
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };
  // Handle like/unlike action
  const handleLikeUnlike = async (artistId) => {
    if (artistList.includes(artistId)) {
      await unlikeArtist(artistId);
      setArtistList(artistList.filter((id) => id !== artistId));
    } else {
      await addToLikedArtists(artistId);
      setArtistList([...artistList, artistId]);
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
          data={artists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <ArtistItem
                  input={item}
                  onLikeUnlike={handleLikeUnlike}
                  isLiked={artistList.includes(item.id)}
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
          data={artists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ArtistItem
                input={item}
                onLikeUnlike={handleLikeUnlike}
                isLiked={artistList.includes(item.id)}
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
