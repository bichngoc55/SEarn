import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import scale from "../constant/responsive";
import { AntDesign } from "@expo/vector-icons";

const PublicPlaylistItem = ({ playlist, onLikeUnlike, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLike = () => {
    onLikeUnlike(playlist._id);
    setLiked(!liked);
  };

  return (
    <TouchableOpacity style={styles.playlistContainer}>
      <Image source={{ uri: playlist.imageURL }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {playlist.name}
        </Text>
        <Text style={styles.description}>
          {playlist.description || "No description provided."}
        </Text>
        <View style={styles.likeContainer}>
          <Text style={styles.likes}>
            {playlist.numberOfLikes > 1
              ? `${playlist.numberOfLikes} likes`
              : `${playlist.numberOfLikes} like`}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLike}>
        <Ionicons
          style={styles.heartBtn}
          name={liked ? "heart" : "heart-outline"}
          size={scale(25)}
          color="#FED215"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playlistContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
  image: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(10),
    marginRight: scale(10),
  },
  details: {
    flex: 1,
    marginRight: scale(10),
  },
  name: {
    fontSize: scale(16),
    fontWeight: "bold",
    fontFamily: "bold",
    color: "white",
  },
  description: {
    fontSize: scale(14),
    fontFamily: "regular",
    color: "white",
  },
  LikeContainer: {
    flexDirection: "row",
    marginRight: scale(10),
    alignItems: "center",
    // justifyContent: "center",
    marginTop: scale(10),
    marginBottom: scale(10),
    marginLeft: scale(10),
  },
  likes: {
    fontSize: scale(12),
    color: "pink",
    fontFamily: "light",
    marginRight: scale(10),
  },
  heartBtn: {
    marginLeft: scale(10),
  },
});

export default PublicPlaylistItem;
