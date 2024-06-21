import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { useSelector, useDispatch, Provider } from "react-redux";
// import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import RenderComment from "../../components/renderComment/renderComment";
import scale from "../../constant/responsive";
import { Entypo } from "@expo/vector-icons";
import { getTrack } from "../../service/songService";
import SongItem from "../../components/songItem";
import MenuOfPlaylist from "../../components/menuOfPlaylist";
import { ScrollView } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";
import axios from "axios";

const PlaylistDetailMongo = ({ route }) => {
  const { playlist } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );

  const [tracks, setTracks] = useState([]);
  const [isPublic, setIsPublic] = useState(playlist.privacyOrPublic);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const songList = playlist.songs;
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [modifiedComment, setModifiedComment] = useState({
    content: "",
    commentId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const { user } = useSelector((state) => state.user);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    getPlaylistDetails();
  };
  const toggleResponses = (commentId) => {
    setSelectedCommentId((prevId) => (prevId === commentId ? null : commentId));
  };
  const handlePostComment = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3005/comment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          userId: user?._id,
        }),
      });
      const data = await response.json();
      // console.log("id ne: ", data._id);
      // console.log(
      //   "link ne: ",
      //   `http://10.0.2.2:3005/${playlist._id}/addComment`
      // );
      const reponseAdd = await fetch(
        `http://10.0.2.2:3005/playlists/${playlist._id}/addComment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: data._id,
          }),
        }
      );
      // console.log("data nho comment: ", JSON.stringify(reponseAdd));
      setNewComment("");
      setSelectedCommentId(null);
      getPlaylistDetails();
    } catch (e) {
      alert("Error in post comment: " + e);
    }
  };
  const handleSubmitModifiedComment = async (modifiedComment) => {
    // console.log(
    //   "modifed : ",
    //   modifiedComment.content,
    //   " ",
    //   modifiedComment.commentId
    // );
    if (!modifiedComment.content.trim() || !modifiedComment.commentId) return;
    const commentId = modifiedComment.commentId;
    // console.log("comment content modified: ", modifiedComment.content.trim());
    // console.log("API: ", `http://10.0.2.2:3005/comment/${commentId}`);
    try {
      const response = await fetch(
        `http://10.0.2.2:3005/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: modifiedComment.content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to modify comment");
      }
      // console.log("sao m k chay");
      const updatedComments = comments.map((comment) =>
        comment._id === modifiedComment.commentId
          ? { ...comment, content: modifiedComment.content }
          : comment
      );
      // console.log("Updated comments : ", JSON.stringify(updatedComments));
      setComments(updatedComments);

      setModifiedComment({ content: "", commentId: null });
    } catch (error) {
      console.error("Error modifying comment:", error);
      alert("Error modifying comment: " + error.message);
    }
  };
  const handleDeleteComment = async (commentId) => {
    // console.log("HEHHEHEHEHE :", commentId);
    try {
      // console.log("HEHEHEH");
      const response = await fetch(
        `http://10.0.2.2:3005/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("HEHHEHEHEHE :", commentId);

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      getPlaylistDetails();
    } catch (e) {}
  };
  const handlePostResponse = async (commentId, responseContent) => {
    try {
      const response = await fetch(
        "http://10.0.2.2:3005/comment/add/response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: commentId,
            userId: user._id,
            content: responseContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post response");
      }
      console.log("Response Data:", JSON.stringify(response));

      setSelectedCommentId(null);
      getPlaylistDetails();
    } catch (e) {
      alert("Error in post response: " + e);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("playlist is focused");
      getPlaylistDetails();
      fetchTracks();
    }
  }, [isFocused]);
  const fetchTracks = async () => {
    try {
      const trackPromises = playlist.songs.map((songId) =>
        getTrack(accessTokenForSpotify, songId)
      );
      const trackData = await Promise.all(trackPromises);
      trackData.forEach((track) => {});
      setTracks(trackData);
    } catch (error) {}
  };

  const getPlaylistDetails = async () => {
    // setIsLoading(true);
    try {
      if (accessToken) {
        const response = await fetch(
          `http://10.0.2.2:3005/playlists/${playlist._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const playlistDetail = await response.json();
        const commentsData = playlistDetail.comments;
        // console.log("comment data: ", commentsData);
        setComments(commentsData);
        setName(playlistDetail.name);
        setDescription(playlistDetail.description);
        setIsPublic(playlistDetail.privacyOrPublic);
      }
    } catch (error) {}
  };
  const renderItem = (data) => <SongItem input={data.item} songList={tracks} />;
  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => updateDeleteFromPlaylist(data.item.id)}
      >
        <View style={styles.deleteButtonContainer}>
          <Text style={styles.backTextWhite}>Xóa</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  const updateDeleteFromPlaylist = async (songIdInput) => {
    try {
      if (accessToken) {
        const updatedSongs = playlist.songs.filter(
          (songId) => songId !== songIdInput
        );
        const newCount = playlist.songCount - 1;
        await axios.patch(
          `http://10.0.2.2:3005/playlists/${playlist._id}`,
          {
            songs: updatedSongs,
            songCounts: newCount,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Success");
        setTracks(tracks.filter((track) => track.id !== songIdInput));
        //showToastDelete();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.img_and_backBtn}>
          <Image
            source={{
              uri: "https://i.scdn.co/image/ab67616d0000b273212f0300aefcb79b00d2a6cf",
            }}
            style={styles.albumImg}
            resizeMode="cover"
          />
          <View style={styles.iconHeader}>
            <View style={styles.backButtonContainer}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back-sharp" size={24} color="black" />
              </Pressable>
            </View>
            <Pressable style={styles.backButton} onPress={toggleModal}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </Pressable>
            <MenuOfPlaylist
              visible={modalVisible}
              onClose={toggleModal}
              playlist={playlist}
            />
          </View>
        </View>
        <View
          style={{ width: "100%", alignItems: "center", marginVertical: "4%" }}
        >
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textDes}>{description}</Text>
          <View style={styles.follow_and_song}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textName}>{tracks.length}</Text>
              <Text style={styles.textDes}>Songs</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              {isPublic ? (
                <MaterialIcons name="public" size={26} color="white" />
              ) : (
                <MaterialIcons name="public-off" size={26} color="white" />
              )}
              <Text style={styles.textDes}>Status</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textName}>{playlist.numberOfLikes}</Text>
              <Text style={styles.textDes}>Likes</Text>
            </View>
          </View>
        </View>
        {/* hehe */}
        <ScrollView style={styles.flatlistContainer}>
          {/* <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <SongItem input={item} songList={tracks} />;
            }}
          /> */}
          <SwipeListView
            data={tracks}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.commentContainer}>
            <View style={styles.commentPost}>
              <TextInput
                style={styles.textComment}
                placeholderTextColor={"grey"}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Viết bình luận..."
              />

              <TouchableOpacity
                onPress={handlePostComment}
                style={{
                  paddingHorizontal: scale(10),
                  paddingVertical: scale(5),
                  borderRadius: scale(10),
                }}
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                minHeight: scale(150),
                marginBottom: scale(20),
              }}
            >
              <FlatList
                data={comments}
                keyExtractor={(comment) => comment._id}
                renderItem={({ item }) => (
                  <RenderComment
                    comment={item}
                    handlePostResponse={handlePostResponse}
                    toggleResponses={toggleResponses}
                    selectedCommentId={selectedCommentId}
                    setModifiedComment={setModifiedComment}
                    onDeleteComment={handleDeleteComment}
                    onSubmitModifiedComment={handleSubmitModifiedComment}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1B",
  },
  img_and_backBtn: {
    width: "100%",
    height: scale(200),
    backgroundColor: "red",
    overflow: "hidden",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  albumImg: {
    position: "absolute",
    width: "100%",
    aspectRatio: 1,
  },
  backButtonContainer: {},
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: 35,
    backgroundColor: "rgba(211, 211, 211, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  iconHeader: {
    marginTop: scale(25),
    marginHorizontal: scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textName: {
    fontSize: scale(16),
    color: "white",
  },
  textDes: {
    fontSize: scale(13),
    fontWeight: "300",
    color: "white",
  },
  follow_and_song: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    marginTop: "4%",
  },
  flatlistContainer: {
    flex: 1,
    marginHorizontal: "6.5%",
    marginBottom: "10%",
  },
  textComment: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    color: "grey",
    placeholderTextColor: "white",
    borderRadius: scale(10),
  },
  commentPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: scale(10),
    borderWidth: 1,
    color: "grey",
    alignItems: "center",
    width: "100%",
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: "5%",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  deleteButtonContainer: {
    backgroundColor: "red",
    borderRadius: 10,
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  backTextWhite: {
    color: "#FFF",
    textAlign: "center",
  },
});
export default PlaylistDetailMongo;
