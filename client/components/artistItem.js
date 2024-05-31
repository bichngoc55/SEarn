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

const ArtistItem = ({ input }) => {
  const navigation = useNavigation();
  const MoveToArtistDetail = () => {
    navigation.navigate("ArtistDetail", {
      artist: input,
    });
  };
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên cha
    setIsLiked(!isLiked);
  };

  return (
    <TouchableOpacity style={styles.albumContainer} onPress={MoveToArtistDetail}>
      <Image source={{ uri: input.images[0].url }} style={styles.circle} />
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
    height: scale(80),
  },
  circle: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(60),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  textName: {
    fontSize: scale(14),
    color: "white",
    flex: 1,
    marginHorizontal: scale(10),
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    justifyContent: "flex-end"
  },
});

export default ArtistItem;
