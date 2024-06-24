import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AudioService from "../service/audioService";
import { getTrack } from "../service/songService";
import { fetchSpotifyAccessToken } from "../redux/spotifyAccessTokenSlice";
import RecentlyPlayingSong from "./recentPlayingSong";

const RecentlyPlayingContainer = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [recentlyPlayingSong, setRecentlyPlayingSong] = useState();

  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const { accessTokenForSpotify } = useSelector((state) => state.spotifyAccessToken);

  const dispatch = useDispatch();
  let service = new AudioService();

  const moveToPlaySong = async () => {
    if (service.currentSong != null) {
      navigation.navigate("PlaySong", { song: service.currentSong });
    } else if (recentlyPlayingSong != null) {
      service.currentTime = 0;
      service.currentSong = recentlyPlayingSong;
      service.playCurrentAudio();
      service.isGetCoin = true;
      navigation.navigate("PlaySong", { song: service.currentSong });
    } else alert("No audio available");
  };

  useEffect(() => {
    dispatch(fetchSpotifyAccessToken());
    const fetchRecentlyPlayingSong = async () => {
      try {
        if (accessTokenForSpotify) {
          const song = await getTrack(accessTokenForSpotify, user?.recentListeningSong);
          setRecentlyPlayingSong(song);
          console.log("Get recentListeningSong from db: " + song.name);
        }
      } catch (error) {
        console.error("Error fetching recently playing song in HomeScreen:", error);
      }
    };
    if (accessTokenForSpotify && user?.recentListeningSong && service.currentSong == null) {
      fetchRecentlyPlayingSong();
    }
  }, [user?._id, accessTokenForSpotify, user?.recentListeningSong, service.currentSong]);

  const updateRecentlyPlayingSong = async (songId) => {
    fetch(`http://10.0.2.2:3005/auth/${user?._id}/updateRecentListeningSong`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((response) => response.json())
      .then((updatedUser) => console.log(updatedUser))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const newRecentlyPlayingSong = async () => {
      try {
        if (accessTokenForSpotify) {
          if (recentlyPlayingSong?.id !== service?.currentSong?.id && service.currentSong) {
            await updateRecentlyPlayingSong(service.currentSong.id);
            setRecentlyPlayingSong(service.currentSong);
          }
        }
      } catch (error) {
        console.error("Error fetching recently playing song in HomeScreen:", error);
      }
    };
    if (accessTokenForSpotify && recentlyPlayingSong !== service.currentSong && user?.recentListeningSong) {
      newRecentlyPlayingSong(); 
    }
  }, [user?._id, accessTokenForSpotify, service?.currentSong]);

  useEffect(() => {
    const handlePlaybackStatus = ({ progress, total }) => {
      setTotal(total);
      //console.log("dang cap nhap recently song");
      setRecentlyPlayingSong(service.currentSong);
    };
    if (isFocused) {
      service.registerPlaybackStatusCallback(handlePlaybackStatus);
      return () => {
        service.unregisterPlaybackStatusCallback(handlePlaybackStatus);
      };
    }
  }, [service.currentSong, isFocused]);

  return (
    <RecentlyPlayingSong 
      recentlyPlayingSong={recentlyPlayingSong}
      moveToPlaySong={moveToPlaySong}
    />
  );
};

export default RecentlyPlayingContainer;