import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSpotifyAccessToken = createAsyncThunk(
  "accessToken/fetchAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/auth/getAccessToken"
      );
      return response.data.accessToken;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  }
);

const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState: {
    accessToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    // ... other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotifyAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpotifyAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(fetchSpotifyAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = accessTokenSlice.actions;
export default accessTokenSlice.reducer;
