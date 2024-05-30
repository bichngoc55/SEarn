import { combineReducers } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { Audio } from "expo-av";

const mediaPlayerSlice = createSlice({
  name: "mediaPlayer",
  initialState: {
    currentSong: null,
    currentPosition: null,
    currentSound: null,
    currentTime: 0,
    isPlaying: false,
    playlist: [],
  },
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    setCurrentSound: (state, action) => {
      state.currentSound = action.payload;
    },
    setCurrentPosition: (state, action) => {
      state.currentPosition = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setCurrentPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const {
  setCurrentSong,
  setCurrentSound,
  setCurrentPosition,
  setCurrentPlaylist,
  setIsPlaying,
  setCurrentTime,
} = mediaPlayerSlice.actions;

export const preloadPlaylist = createAsyncThunk(
  "audio/preloadPlaylist",
  async ({ currentSong, currentPosition, playlist }, { dispatch }) => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: false,
      });

      const audioPlayer = new Audio.Sound();

      // Preload all songs in the playlist
      await Promise.all(
        Object.values(playlist).map(async (song) => {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({ uri: song.preview_url });
        })
      );

      // Load the current song
      await audioPlayer.loadAsync({
        uri: currentSong.preview_url,
      });

      // Listen for audio interruptions
      audioPlayer.setOnPlaybackStatusUpdate((status) => {
        if (status.isInterruptedByOtherAudio) {
          audioPlayer.pauseAsync();
        }
      });

      // Update the Redux state with the new audioPlayer instance
      // return audioPlayer;
      return new Promise((resolve) => {
        resolve(audioPlayer);
      });
    } catch (error) {
      console.error("Error preloading playlist:", error);
      throw error;
    }
  }
);

export const playPause = createAsyncThunk(
  "audio/playPause",
  async ({ audioPlayer, isPlaying }, { dispatch }) => {
    try {
      if (audioPlayer) {
        if (isPlaying) {
          await audioPlayer.pauseAsync();
          dispatch(setIsPlaying(false));
          console.log("Dừng");
        } else {
          await audioPlayer.playAsync();
          dispatch(setIsPlaying(true));
          console.log("Phát");
        }
      }
    } catch (error) {
      console.error("Error playing/pausing audio:", error);
      throw error;
    }
  }
);

export const playRandomSong = createAsyncThunk(
  "audio/playRandomSong",
  async ({ audioPlayer, playlist, currentPosition }, { dispatch }) => {
    try {
      let index = Math.floor(Math.random() * playlist.length);
      while (index == currentPosition) {
        index = Math.floor(Math.random() * playlist.length);
      }
      dispatch(setCurrentSong(playlist[index]));
      dispatch(setCurrentPosition(index));
      dispatch(setIsPlaying(true));
      audioPlayer.setPositionAsync(0);
      dispatch(setCurrentTime(0));
      await audioPlayer.unloadAsync();
      await audioPlayer.loadAsync({
        uri: playlist[index].preview_url,
      });
      await audioPlayer.playAsync();
    } catch (error) {
      console.error("Error playing random song:", error);
      throw error;
    }
  }
);

export const playNextSong = createAsyncThunk(
  "audio/playNextSong",
  async ({ audioPlayer, playlist, currentPosition }, { dispatch }) => {
    try {
      const audioPlayerStatus = await audioPlayer.getStatusAsync();
      // If the audioPlayer is not loaded, try to load it
      if (audioPlayerStatus.isLoaded === false) {
        await audioPlayer.loadAsync();
      }
      await audioPlayer.stopAsync();
      console.log(currentPosition);

      let nextIndex = currentPosition + 1;
      if (nextIndex >= playlist.length) {
        nextIndex = 0;
      }
      dispatch(setCurrentSong(playlist[nextIndex]));
      dispatch(setCurrentPosition(nextIndex));
      console.log("Position moi" + currentPosition);
      dispatch(setIsPlaying(true));
      audioPlayer.setPositionAsync(0);
      dispatch(setCurrentTime(0));
      await audioPlayer.unloadAsync();
      await audioPlayer.loadAsync({
        uri: playlist[nextIndex].preview_url,
      });
      await audioPlayer.playAsync();
      console.log(nextIndex);
    } catch (error) {
      console.error("Error playing next song:", error);
      throw error;
    }
  }
);

export const playBackSong = createAsyncThunk(
  "audio/playBackSong",
  async ({ audioPlayer, playlist, currentPosition }, { dispatch }) => {
    try {
      await audioPlayer.stopAsync();

      // Calculate the previous index
      let prevIndex = currentPosition - 1;
      if (prevIndex < 0) {
        prevIndex = playlist.length - 1;
      }
      dispatch(setCurrentSong(playlist[prevIndex]));
      dispatch(setCurrentPosition(prevIndex));
      dispatch(setIsPlaying(true));
      audioPlayer.setPositionAsync(0);
      dispatch(setCurrentTime(0));
      await audioPlayer.unloadAsync();
      await audioPlayer.loadAsync({
        uri: playlist[prevIndex].preview_url,
      });
      await audioPlayer.playAsync();
    } catch (error) {
      console.error("Error playing previous song:", error);
      throw error;
    }
  }
);
export default mediaPlayerSlice.reducer;
