import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import scale from "../constant/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ArtistAlbumItem = ({ input, onLikeUnlike, isLiked }) => {
  const navigation = useNavigation();
  const MoveToListAlbum = () => {
    navigation.navigate("AlbumDetail", {
      album: input,
    });
  };

  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLike = () => {
    onLikeUnlike(input.id);
    setLiked(!liked);
  };

  return (
    <TouchableOpacity style={styles.albumContainer} onPress={MoveToListAlbum}>
      <Image source={{ uri: input.images[0].url }} style={styles.img} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.textName} numberOfLines={2} ellipsizeMode="tail">
          {input.name}
        </Text>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons
            style={styles.heartBtn}
            name={isLiked ? "heart" : "heart-outline"}
            size={scale(25)}
            color="#FED215"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: scale(12),
    marginRight: scale(20),
    borderRadius: scale(15),
    height: scale(180),
    width: scale(140),
    overflow: "hidden",
  },
  img: {
    width: scale(140),
    height: scale(140),
    // borderRadius: scale(60),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  textName: {
    fontFamily: "semiBold",
    color: "white",
    marginHorizontal: scale(10),
    flex: 1,
  },
  heartBtn: {
    marginHorizontal: scale(10),
  },
});

export default ArtistAlbumItem;
