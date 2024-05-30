import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TrackPlayer from "react-native-track-player";

// Khởi tạo trình phát
export const initTrackPlayer = createAsyncThunk(
  "trackPlayer/init",
  async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(playlist);
  }
);

export const addToPlaylist = createAsyncThunk(
  "trackPlayer/addToPlaylist",
  async (track) => {
    await TrackPlayer.add(track);
  }
);

export const playTrack = createAsyncThunk(
  "trackPlayer/playTrack",
  async (trackId) => {
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  }
);

export const pauseTrack = createAsyncThunk(
  "trackPlayer/pauseTrack",
  async () => {
    await TrackPlayer.pause();
  }
);

export const skipToNext = createAsyncThunk(
  "trackPlayer/skipToNext",
  async () => {
    await TrackPlayer.skipToNext();
  }
);

export const skipToPrevious = createAsyncThunk(
  "trackPlayer/skipToPrevious",
  async () => {
    await TrackPlayer.skipToPrevious();
  }
);

const trackPlayerSlice = createSlice({
  name: "trackPlayer",
  initialState: {
    currentSong: null,
    currentPosition: null,
    currentTotalDuration: null,
    isPlaying: false,
    playlist: [],
  },
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    setCurrentTotalDuration: (state, action) => {
      state.currentSound = action.payload;
    },
    setCurrentPosition: (state, action) => {
      state.currentPosition = action.payload;
    },
    setCurrentPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    togglePlayPause: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const {
  setCurrentSong,
  setCurrentTotalDuration,
  setCurrentPosition,
  setCurrentPlaylist,
  togglePlayPause,
} = trackPlayerSlice.actions;
export default trackPlayerSlice.reducer;
