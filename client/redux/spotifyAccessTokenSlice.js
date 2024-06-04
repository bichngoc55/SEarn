import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSpotifyAccessToken = createAsyncThunk(
  "accessToken/fetchAccessToken",
  async (_, { rejectWithValue }) => {
    try {
        console.log("lấy updateSpotifyAccessToken");
      const response = await axios.get(
        "http://10.0.2.2:3005/auth/getAccessToken"
      ); 
      // const data =await  response.json();
      // console.log("data trong fetch spotify access token: "+ data.accessToken);
      // dispatch(updateSpotifyAccessToken(data.accessToken));
      // const newAccessToken = await AsyncStorage.setItem("spotifyAccessToken", data.accessToken);
      // console.log("new access token for spotify : "+ newAccessToken);
      return response.data.accessToken;
    } catch (error) {
      return rejectWithValue("error.response.data");
    }
  }
);

const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState: {
    accessTokenForSpotify: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAccessTokenRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAccessTokenSuccess: (state, action) => {
      state.loading = false;
      state.accessTokenForSpotify = action.payload;
    },
    fetchAccessTokenFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // updateSpotifyAccessToken: (state, action) => {
    //   state.accessTokenForSpotify = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotifyAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpotifyAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessTokenForSpotify = action.payload;
      })
      .addCase(fetchSpotifyAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  fetchAccessTokenRequest,
  fetchAccessTokenSuccess,
  fetchAccessTokenFailure,
} = accessTokenSlice.actions;
export default accessTokenSlice.reducer;
