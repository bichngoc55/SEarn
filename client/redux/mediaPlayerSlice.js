import { combineReducers } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const mediaPlayerSlice = createSlice({
  name: "mediaPlayer",
  initialState: {
    currentSong: null,
    currentPosition: null,
    currentSound: null,
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
    setCurrentPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const {
  setCurrentSong,
  setCurrentSound,
  setCurrentPosition,
  setCurrentPlaylist,
  togglePlayPause,
} = mediaPlayerSlice.actions;
export default mediaPlayerSlice.reducer;
