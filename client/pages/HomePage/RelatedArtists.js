import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import scale from "../../constant/responsive";
import { COLOR } from "../../constant/color";
import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import { getRelatedArtists } from "../../service/getRelatedArtists";
import ArtistItem from "../../components/artistItem";
import { getLikedArtistList } from "../../service/getLikedArtistList";
import { getTracksRecommendations } from "../../service/songsRecommendations";

export default function RelatedArtist() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const isLoading = useSelector((state) => state.spotifyAccessToken.loading);
  const error = useSelector((state) => state.spotifyAccessToken.error);

  // useEffect(() => {
  //   const { accessToken, expires_in } = dispatch(fetchSpotifyAccessToken());
  //   // console.log(
  //   //   "new access token for spotify in new related artist screen: " +
  //   //     accessToken
  //   // );
  // }, [dispatch]);

  const [artistList, setArtistList] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [likedArtistList, setLikedArtistList] = useState([]);

  //get >=5 liked artist list on db
  const fetchArtistList = useCallback(async () => {
    try {
      if (accessToken) {
        // const listLikedArtists = await user?.likedArtists
        const { listLikedArtists } = await getLikedArtistList(
          accessToken,
          user?._id
        );
        const artistIds = listLikedArtists.map((likedArtist) => likedArtist.id);
        setLikedArtistList(artistIds);
        let finalArtistList = artistIds;
        if (artistIds.length > 5) {
          finalArtistList = artistIds
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
        } else if (artistIds.length === 0) {
          const recommendations = await getTracksRecommendations(
            accessTokenForSpotify
          );
          finalArtistList = recommendations.items
            .slice(0, 20)
            .map((item) => item.track.artists[0].id);
        }

        setArtistList(finalArtistList);
      } else {
        // alert("Chưa có accessToken");
      }
    } catch (error) {
      console.error("Error fetching liked artists:", error);
    }
  }, [accessToken, user?._id, accessTokenForSpotify]);

  //get Related artist
  const fetchRelatedArtists = useCallback(async () => {
    try {
      if (accessTokenForSpotify && likedArtistList.length > 0) {
        const artistPromises = artistList.map((artistId) =>
          getRelatedArtists(accessTokenForSpotify, artistId)
        );
        const relatedArtistsData = await Promise.all(artistPromises);

        const allRelatedArtists = relatedArtistsData.flatMap(
          (data) => data.artists
        );
        // Đảm bảo rằng các related artist trùng nhau thì sẽ chỉ lấy 1
        const uniqueRelatedArtists = Array.from(
          new Set(allRelatedArtists.map((artist) => artist.id))
        ).map((id) => allRelatedArtists.find((artist) => artist.id === id));

        setRelatedArtists(uniqueRelatedArtists);
      } else {
        // alert("accessToken:" + accessTokenForSpotify);
      }
    } catch (error) {
      console.error("Error fetching related artists hehe:", error);
    }
  }, [accessTokenForSpotify, artistList]);

  useEffect(() => {
    if (!isDataFetched) {
      fetchArtistList().then(() => {
        fetchRelatedArtists();
        setIsDataFetched(true);
      });
    }
  }, [isDataFetched, fetchArtistList, fetchRelatedArtists]);

  useFocusEffect(
    useCallback(() => {
      if (!isDataFetched) {
        fetchArtistList().then(() => {
          fetchRelatedArtists();
          setIsDataFetched(true);
        });
      }
    }, [isDataFetched, fetchArtistList, fetchRelatedArtists])
  );

  //add like artist to db
  const addToLikedArtists = async (artistId) => {
    fetch(`http://10.0.2.2:3005/auth/${user._id}/addLikedArtists`, {
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
    fetch(`http://10.0.2.2:3005/auth/${user._id}/unlikeArtists`, {
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
    if (likedArtistList.includes(artistId)) {
      await unlikeArtist(artistId);
      setLikedArtistList(likedArtistList.filter((id) => id !== artistId));
    } else {
      await addToLikedArtists(artistId);
      setLikedArtistList([...likedArtistList, artistId]);
    }
    // Cập nhật lại danh sách nghệ sĩ liên quan sau khi thay đổi trạng thái like/unlike
    fetchArtistList().then(() => {
      fetchRelatedArtists();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.flatlistContainer}>
          <FlatList
            data={relatedArtists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <ArtistItem
                  input={item}
                  onLikeUnlike={handleLikeUnlike}
                  isLiked={likedArtistList.includes(item.id)}
                />
              );
            }}
            nestedScrollEnabled={true}
            ListFooterComponent={<View style={{ height: scale(120) }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  content: {
    marginHorizontal: scale(10),
    flex: 1,
    marginTop: scale(10),
  },
  title: {
    marginVertical: scale(10),
    color: "white",
    fontSize: 20,
    fontFamily: "bold",
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
});
