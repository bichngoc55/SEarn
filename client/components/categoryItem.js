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
import { COLOR } from "../constant/color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CategoryItem = ({ input }) => {
  const navigation = useNavigation();
  const MoveToCategoryDetail = () => {
    navigation.navigate("CategoryDetail", {
      category: input,
    });
  };
  

  return (
    <TouchableOpacity style={styles.container} onPress={MoveToCategoryDetail}>
      <Text style={styles.textName} numberOfLines={2} ellipsizeMode="tail">
        {input.name}
      </Text>
      <Image source={{ uri: input.icons[0].url }} style={styles.img} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2b2b2b",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: scale(15),
    marginHorizontal: scale(12),
    borderRadius: scale(15),
    height: scale(100),
    width:scale(150),
    overflow: "hidden", 
    shadowColor: 'blue',
    shadowOffset: {
      width: -scale(10),
      height: -scale(10)
    },
    shadowOpacity: 2,
    shadowRadius: 20,
    elevation: 10,
  },
  img: {
    width: scale(150),
    height: scale(100),
    // borderRadius: scale(60),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginTop:scale(2)
  },
  textName: {
    fontSize: scale(14),
    color: COLOR.hightlightText,
    marginHorizontal: scale(5),
    fontFamily: "semiBold"
  },
//   heartBtn: {
//     marginHorizontal: scale(10),
//   },
});

export default CategoryItem;
