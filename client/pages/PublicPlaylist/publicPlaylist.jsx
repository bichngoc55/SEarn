// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   TextInput,
//   FlatList,
//   Button,
//   SafeAreaView,
//   Pressable,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { SelectList } from "react-native-dropdown-select-list";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { COLOR } from "../../constant/color";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";
// import scale from "../../constant/responsive";
// import PublicPlaylistItem from "../../components/publicPlaylistItem";
// import { useSelector, useDispatch } from "react-redux";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FontAwesome } from "@expo/vector-icons";
// const PublicPlaylist = () => {
//   const [publicPlaylist, setPublicPlaylist] = useState(null);
//   const [selected, setSelected] = useState("");
//   const { user } = useSelector((state) => state.user);
//   const navigation = useNavigation();
//   const userId = user?._id;

//   const data = [
//     { key: "1", value: "Trending playlist" },
//     { key: "2", value: "Your liked playlist" },
//   ];
//   const [allPlaylistList, setAllPlaylistList] = useState([]);
//   const [likedPlaylist, setLikedPlaylist] = useState([]);
//   const [renderedPlaylist, setRenderedPlaylist] = useState([]);
//   const [isLiked, setIsLiked] = useState(true);
//   const [isDescending, setIsDescending] = useState(true);
//   const [updatedPlaylist, setUpdatedPlaylist] = useState(null);
//   const [coin, setCoin] = useState(0);

//   const handleSelected = async (selected) => {
//     if (selected === "Trending playlist") {
//       await setRenderedPlaylist(allPlaylistList);
//     } else if (selected === "Your liked playlist") {
//       await setRenderedPlaylist(likedPlaylist);
//     }
//   };

//   useEffect(() => {
//     const fetchPublicPlaylists = async () => { 
//       try {
//         const response = await fetch("http://10.0.2.2:3005/playlists/public", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         // console.log("public playlist " + JSON.stringify(data, null, 2));
//         setAllPlaylistList(data);
//         setRenderedPlaylist(data);
//       } catch (error) {
//         console.error("Error fetching public playlists:", error);
//       }
//     };

//     const fetchLikedPlaylists = async () => {
//       try {
//         const response = await fetch(
//           `http://10.0.2.2:3005/playlists/liked/${user._id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await response.json();
//         // console.log("like playlist " + JSON.stringify(data, null, 2));
//         setLikedPlaylist(data);
//       } catch (error) {
//         console.error("Error fetching liked playlists:", error);
//       }
//     };

//     fetchPublicPlaylists();
//     fetchLikedPlaylists();
//   }, [user?._id]);
//   const handleLikeUnlike = async (playlistId) => {
//     try {
//       const response = await fetch(
//         `http://10.0.2.2:3005/playlists/liked/${playlistId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId: user?._id }),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setLikedPlaylist((prevLikedPlaylist) =>
//           prevLikedPlaylist.map((playlist) =>
//             playlist._id === data._id ? data : playlist
//           )
//         );
//         setRenderedPlaylist((prevRenderedPlaylist) =>
//           prevRenderedPlaylist.map((playlist) =>
//             playlist._id === data._id ? data : playlist
//           )
//         );
//         console.log("Data being sent:", JSON.stringify(data, null, 2));
//         setCoin(data.userCoin);
//       } else {
//         console.error("Error liking/unliking playlist:", data.message);
//       }
//     } catch (error) {
//       console.error("Error liking/unliking playlist:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchCoinBalance = async () => {
//       try {
//         console.log("userId: " + userId);
//         const response = await fetch(
//           `http://10.0.2.2:3005/auth/${userId}/coins`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await response.json();
//         // console.log("Data being sent:", JSON.stringify(data, null, 2));
//         if (response.ok) {
//           setCoin(data.userCoin);
//         } else {
//           console.error("Error getting coin:", data.message);
//         }
//       } catch (error) {
//         console.error("Error show token  :", error);
//       }
//     };

//     fetchCoinBalance();
//   }, [userId]);

//   //   const handleShowToken = async () => {
//   //     try {
//   //       const response = await fetch(
//   //         `http://localhost:3005/auth/${userId}/coins`,
//   //         {
//   //           method: "GET",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //         }
//   //       );
//   //       const data = await response.json();
//   //       console.log("Data being sent:", JSON.stringify(data, null, 2));
//   //       if (response.ok) {
//   //         setCoin(data.coin);
//   //       } else {
//   //         console.error("Error getting coin:", data.message);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error show token  :", error);
//   //     }
//   //   };
//   const handleSort = async () => {
//     console.log("Sorting...");
//     const sortedPlaylist = [...renderedPlaylist];

//     if (isDescending) {
//       sortedPlaylist.sort((a, b) => a.numberOfLikes - b.numberOfLikes);
//     } else {
//       sortedPlaylist.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
//     }

//     setIsDescending(!isDescending);

//     setRenderedPlaylist(sortedPlaylist);
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.backButtonContainer}>
//         <Pressable
//           style={styles.backButton}
//           onPress={() => navigation.navigate("UserProfile")}
//         >
//           <Ionicons name="chevron-back-sharp" size={24} color="black" />
//         </Pressable>
//       </View>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Text style={styles.title}>
//             Token Balance :{" "}
//             <FontAwesome5 name="coins" size={24} color="white" /> {coin}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.middle}>
//         <TouchableOpacity onPress={handleSort}>
//           <MaterialCommunityIcons
//             name="sort-clock-ascending-outline"
//             color={COLOR.btnBackgroundColor}
//             size={30}
//           />
//         </TouchableOpacity>
//         <SelectList
//           onSelect={() => handleSelected(selected)}
//           setSelected={(value) => setSelected(value)}
//           fontFamily="regular"
//           save="value"
//           style={styles.input}
//           placeholder="Select a playlist"
//           //   placeholder={{color: 'red'}}
//           placeholderTextColor="white"
//           data={data}
//           closeicon={
//             <MaterialCommunityIcons
//               name="chevron-right"
//               size={24}
//               color="white"
//             />
//           }
//           arrowicon={
//             <FontAwesome name="chevron-down" size={12} color={"white"} />
//           }
//           searchicon={<FontAwesome name="search" size={12} color={"white"} />}
//           search={false}
//           dropdownStyles={{
//             // backgroundColor: "#1C1B1B",
//             width: "70%",
//             color: "white",
//             marginLeft: scale(20),
//           }}
//           dropdownTextStyles={{ color: "white" }}
//           boxStyles={{
//             marginLeft: scale(20),
//             color: "white",
//             placeholderTextColor: "white",
//             width: "70%",
//             backgroundColor: "grey",
//           }}
//           boxTextStyles={{
//             color: "white",
//             marginLeft: scale(20),
//             width: "70%",
//             // backgroundColor: "#1C1B1B",
//           }}
//         />
//       </View>
//       <View style={styles.flatlistContainer}>
//         {renderedPlaylist.length > 0 ? (
//           <FlatList
//             data={renderedPlaylist}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => (
//               <PublicPlaylistItem
//                 playlist={item}
//                 onLikeUnlike={handleLikeUnlike}
//                 isLiked={item?.listUserIdLikes.includes(user?._id)}
//               />
//             )}
//           />
//         ) : (
//           <Text style={{ color: "white" }}>
//             You haven't liked any playlists yet.
//           </Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#1C1B1B",
//   },
//   backButtonContainer: {
//     marginTop: scale(20),
//     marginLeft: scale(15),
//   },
//   backButton: {
//     width: scale(35),
//     height: scale(35),
//     borderRadius: scale(100),
//     backgroundColor: "rgba(211, 211, 211, 0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backButtonIcon: {
//     width: scale(25),
//     height: scale(25),
//     marginLeft: scale(10),
//   },
//   title: {
//     color: COLOR.textPrimaryColor,
//     fontSize: scale(20),
//     fontFamily: "regular",
//     marginTop: scale(15),
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignContent: "center",
//   },
//   middle: {
//     flexDirection: "row",
//     marginTop: scale(20),
//     alignItems: "center",
//     marginLeft: scale(20),
//   },
//   flatlist: {
//     flex: 1,
//     marginTop: scale(20),
//   },
//   flatlistContainer: {
//     marginTop: scale(20),
//     marginHorizontal: scale(10),
//   },
//   playlistItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: scale(20),
//     paddingVertical: scale(10),
//     borderBottomWidth: 1,
//     borderBottomColor: "gray",
//   },
//   input: {
//     placeholderTextColor: "white",
//   },
// });

// export default PublicPlaylist;
