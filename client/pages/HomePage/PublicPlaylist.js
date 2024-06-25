import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLOR } from "../../constant/color";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import scale from "../../constant/responsive";
import PublicPlaylistItem from "../../components/publicPlaylistItem";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

export default function PublicPlaylist() {
  // const [publicPlaylist, setPublicPlaylist] = useState(null);
  // const [selected, setSelected] = useState("");
  // const { user } = useSelector((state) => state.user);
  // const navigation = useNavigation();
  // const userId = user?._id;

  // const data = [
  //   { key: "1", value: "Trending playlist" },
  //   { key: "2", value: "Your liked playlist" },
  // ];
  // const [allPlaylistList, setAllPlaylistList] = useState([]);
  // const [likedPlaylist, setLikedPlaylist] = useState([]);
  // const [renderedPlaylist, setRenderedPlaylist] = useState([]);
  // const [isLiked, setIsLiked] = useState(true);
  // const [isDescending, setIsDescending] = useState(true);
  // const [updatedPlaylist, setUpdatedPlaylist] = useState(null);
  // const [coin, setCoin] = useState(0);

  // const handleSelected = async (selected) => {
  //   if (selected === "Trending playlist") {
  //     await setRenderedPlaylist(allPlaylistList);
  //   } else if (selected === "Your liked playlist") {
  //     await setRenderedPlaylist(likedPlaylist);
  //   }
  // };

  // const fetchPublicPlaylists = async () => {
  //   try {
  //     const response = await fetch("http://10.0.2.2:3005/playlists/public", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     // console.log("public playlist " + JSON.stringify(data, null, 2));
  //     setAllPlaylistList(data);
  //     setRenderedPlaylist(data);
  //   } catch (error) {
  //     console.error("Error fetching public playlists:", error);
  //   }
  // };

  // const fetchLikedPlaylists = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://10.0.2.2:3005/playlists/liked/${user?._id}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     // console.log("like playlist " + JSON.stringify(data, null, 2));
  //     setLikedPlaylist(data);
  //   } catch (error) {
  //     console.error("Error fetching liked playlists:", error);
  //   }
  // };
  // const handleLikeUnlike = async (playlistId) => {
  //   try {
  //     const response = await fetch(
  //       `http://10.0.2.2:3005/playlists/liked/${playlistId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userId: user?._id }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       setLikedPlaylist((prevLikedPlaylist) =>
  //         prevLikedPlaylist.map((playlist) =>
  //           playlist._id === data._id ? data : playlist
  //         )
  //       );
  //       setRenderedPlaylist((prevRenderedPlaylist) =>
  //         prevRenderedPlaylist.map((playlist) =>
  //           playlist._id === data._id ? data : playlist
  //         )
  //       );
  //       console.log("Data being sent:", JSON.stringify(data, null, 2));
  //       setCoin(data.userCoin);
  //     } else {
  //       console.error("Error liking/unliking playlist:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error liking/unliking playlist:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchPublicPlaylists();
  //   fetchLikedPlaylists();
  // }, [user?._id]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     fetchPublicPlaylists();
  //     fetchLikedPlaylists();
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  // useEffect(() => {
  //   const fetchCoinBalance = async () => {
  //     if (!userId) {
  //       console.error("User ID is undefined");
  //       return;
  //     }
  //     try {
  //       const response = await fetch(
  //         `http://10.0.2.2:3005/auth/${userId}/coins`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const data = await response.json();
  //       if (response.ok) {
  //         setCoin(data.userCoin);
  //       } else {
  //         console.error("Error getting coin:", data.message);
  //       }
  //     } catch (error) {
  //       console.error("Error showing token:", error);
  //     }
  //   };

  //   if (userId) {
  //     fetchCoinBalance();
  //   }
  // }, [userId]);

  // const handleSort = async () => {
  //   console.log("Sorting...");
  //   const sortedPlaylist = [...renderedPlaylist];

  //   if (isDescending) {
  //     sortedPlaylist.sort((a, b) => a.numberOfLikes - b.numberOfLikes);
  //   } else {
  //     sortedPlaylist.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
  //   }

  //   setIsDescending(!isDescending);

  //   setRenderedPlaylist(sortedPlaylist);
  // };
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.title}>
            Token Balance :{" "}
            <FontAwesome5 name="coins" size={24} color="white" /> {coin}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.middle}>
        <SelectList
          onSelect={() => handleSelected(selected)}
          setSelected={(value) => setSelected(value)}
          fontFamily="regular"
          save="value"
          style={styles.input}
          placeholder="Select a playlist"
          data={data}
          arrowicon={
            <FontAwesome
              name="chevron-down"
              size={12}
              color={"white"}
              style={{ alignSelf: "center" }}
            />
          }
          search={false}
          dropdownStyles={{
            backgroundColor: "#1C1B1B",
            width: "70%",
            color: "white",
            marginTop: scale(40),
            position: "absolute",
            zIndex: 2,
          }}
          dropdownTextStyles={{ color: "white" }}
          boxStyles={{
            color: "white",
            placeholderTextColor: "white",
            width: "70%",
            backgroundColor: "rgba(130, 130, 130, 0.85)",
          }}
        />
        <TouchableOpacity onPress={handleSort}>
          <MaterialCommunityIcons
            name="sort-numeric-descending"
            color={COLOR.btnBackgroundColor}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.flatlistContainer}>
        {renderedPlaylist.length > 0 ? (
          <FlatList
            data={renderedPlaylist}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <PublicPlaylistItem
                playlist={item}
                onLikeUnlike={handleLikeUnlike}
                isLiked={item?.listUserIdLikes.includes(user?._id)}
              />
            )}
            ListFooterComponent={<View style={{ height: scale(200) }} />}
          />
        ) : (
          <Text style={{ color: "white" }}>
            You haven't liked any playlists yet.
          </Text>
        )}
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1B",
  },
  title: {
    color: COLOR.textPrimaryColor,
    fontSize: scale(20),
    fontFamily: "regular",
    marginTop: scale(15),
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  middle: {
    flexDirection: "row",
    marginTop: scale(20),
    alignItems: "center",
    marginHorizontal: scale(20),
    justifyContent: "space-between",
  },
  flatlistContainer: {
    marginTop: scale(20),
    marginHorizontal: scale(10),
    zIndex: 1,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  input: {},
});
