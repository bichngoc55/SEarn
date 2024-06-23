import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar 
} from "react-native";

import scale from "../../constant/responsive";

import { useSelector, useDispatch, Provider } from "react-redux";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { categoriesService } from "../../service/categoriesService";
import CategoryItem from "../../components/categoryItem";
import { getSearch } from "../../service/searchService";
import SearchItem from "../../components/searchItem";

export default function ExploreScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  ); 
  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
  }, [dispatch]);

  const [categoriesList, setCategoriesList ] = useState([]);
  const [searchText, setSearchText] = useState(""); // State lưu trữ giá trị nhập liệu
  const [searchList, setSearchList] = useState([]);
  const [searchTrackList, setSearchTrackList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (accessTokenForSpotify) {
          const { items } = await categoriesService(accessTokenForSpotify);
          const categoriesPromises = [...items];
          const categoriesData = await Promise.all(categoriesPromises);
          categoriesData.forEach((category) => {});
          setCategoriesList(categoriesData);
        } else alert("accessToken:" + accessTokenForSpotify);
      } catch (error) {
        console.error("Error fetching browse categories hehe:", error);
      }
    };
    fetchCategories();
  }, [accessTokenForSpotify]); 

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (accessTokenForSpotify && searchText) {
          const searchResults = await getSearch(accessTokenForSpotify, searchText);
          const combinedResults = [
            ...searchResults.tracks,
            ...searchResults.artists,
            ...searchResults.albums,
          ];
          setSearchList(combinedResults);
          setSearchTrackList(searchResults.tracks);

        } else {
          setSearchList([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
  
    fetchSearchResults();
  }, [accessTokenForSpotify, searchText]);

    const filteredSearchs = searchList.filter((search) =>
      search.name.toLowerCase().includes(searchText.toLowerCase())
    ); // Lọc danh sách theo giá trị nhập liệu

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search-outline"
          size={24}
          style={{marginHorizontal: scale(10)}}
          color="#737373" 
        />
        <TextInput placeholder="Search for artists, albums, songs" value={searchText}
          onChangeText={(text) => setSearchText(text)} // Cập nhật state khi có nhập liệu
        />
      </View>
      <View style={styles.content}>
        {searchText  ? ( // Kiểm tra nếu có nhập liệu thì hiển thị FlatList đã lọc, ngược lại hiển thị FlatList ban đầu
          <FlatList
            key={1}
            data={filteredSearchs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <SearchItem input={item} songList = {searchTrackList}/>;
            }}
            nestedScrollEnabled={true}
            style={styles.flatlistContainer}
            ListFooterComponent={<View style={{ height: scale(120) }} />}
          />
        ) : (
          <FlatList
            data={categoriesList}
            numColumns={2}
            key={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => { 
              return <CategoryItem input={item} />;
            }}
            nestedScrollEnabled={true}
            style={styles.flatlistContainer}
            ListFooterComponent={<View style={{ height: scale(120) }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "black",
  },
  searchBarContainer: {
    margin: scale(20),
    backgroundColor: "#D9D9D9",
    height: scale(40),
    borderRadius: scale(20),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: 'white',
    shadowOffset: {
      width: -scale(10),
      height: -scale(10)
    },
    shadowOpacity: 2,
    shadowRadius: 20,
    elevation: 10,

  },
  content:{
    flex: 1,
    justifyContent: "center",
    alignItems:"center", 
  },
  flatlistContainer: {
    marginHorizontal: scale(10),
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
