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

const AlbumItem = ({ input, onLikeUnlike, isLiked   }) => { 
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
      <Image source={{ uri: input.images[0].url }} style={styles.circle} />
      <View style={{ flexDirection: "column", flex: 1, marginRight: scale(10), height: scale(60), justifyContent: "space-between"}}>
        <Text style={styles.textName} numberOfLines={2} ellipsizeMode="tail">
          {input.name}
        </Text>
        <Text style={styles.textArtist}>
          {input.artists.map((artist) => artist.name).join(", ")}{" "}
        </Text>
      </View>
      <TouchableOpacity>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons
            style={styles.heartBtn}
            name={isLiked ? "heart" : "heart-outline"}
            size={scale(25)}
            color="#FED215"
          />
        </TouchableOpacity>
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
  },
  textArtist: {
    fontSize: scale(12),
    color: "white",
    justifyContent: "flex-end"
  },
});

export default AlbumItem;
