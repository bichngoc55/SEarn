import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSpotifyAccessToken = createAsyncThunk(
  "accessToken/fetchAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("hêhhe");
      const response = await axios.get(
        "https://0452-2405-4802-a632-dc60-6480-d96f-a630-5850.ngrok-free.app/auth/getAccessToken"
      );

      // console.log("response: " + JSON.stringify(response));
      const { data } = await response;
      // console.log("chay di ba noi: " + JSON.stringify(data));
      //   console.log("hêhhe");
      const { accessToken, expires_in } = data;
      // // console.log("data cua spotify access token2: ");
      // console.log("data cua spotify access token: " + accessToken);
      return { accessToken, expires_in };
      //       return response.data.accessToken;
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
    updateSpotifyAccessToken: (state, action) => {
      console.log("trong update spotify access token " + action.payload);
      state.accessTokenForSpotify = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotifyAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpotifyAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessTokenForSpotify = action.payload.accessToken;
        // console.log("action payload " + JSON.stringify(action.payload));
        // console.log(
        //   "trong fetch spotify access token fullfil : " +
        //     state.accessTokenForSpotify
        // );
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
