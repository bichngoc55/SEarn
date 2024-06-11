import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  //   expiresAt: null,
  error: null,
};
export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (currentAccessToken, { rejectWithValue, dispatch }) => {
    try {
      //   console.log(
      //     "Current Access Token inside refresh function:",
      //     currentAccessToken
      //   );

      if (!currentAccessToken) {
        throw new Error("Refresh token is missing");
      }
      const refreshToken = await AsyncStorage.getItem("userToken");
      //   console.log(
      //     " inside refresh access token slice and here is refresh token :" +
      //       refreshToken
      //   );

      if (!refreshToken) {
        throw new Error("Refresh token is missing");
      }

      const response = await fetch(
        "https://b3bd-183-80-111-110.ngrok-free.app/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }

      const data = await response.json();
      //   console.log("data trong refresh: " + JSON.stringify(data));
      dispatch(updateAccessToken(data.accessToken));
      //   console.log("Inside refresh function " + state.accessToken);
      await AsyncStorage.setItem("userToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      //   console.log("Inside login user in user slice");
      const response = await fetch(
        "https://b3bd-183-80-111-110.ngrok-free.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (data.msg === "User does not exist.") {
          throw new Error("User does not exist.");
        } else if (data.msg === "Invalid credentials.") {
          throw new Error("Invalid credentials.");
        } else {
          throw new Error("Login failed");
        }
      }

      const data = await response.json();
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      //   await AsyncStorage.setItem("accessToken", data.accessToken);
      if (data && data.accessToken) {
        await AsyncStorage.setItem("userToken", data.accessToken);
      }
      //   console.log(
      //     "Inside frontend login user in user slice and acceess token ( please compare) : " +
      //       data.accessToken
      //   );

      //   console.log(data.accessToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("user");
      const resultRemove = await AsyncStorage.removeItem("userToken");
      console.log("Removed user and token : " + resultRemove);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    updateUserName: (state, action) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload;
        // const currentAccessToken = state.accessToken;
        // console.log("Refreshed access token:", currentAccessToken);
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError, updateAccessToken, updateUserName } =
  userSlice.actions;

export default userSlice.reducer;
