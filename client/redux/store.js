/* eslint-disable prettier/prettier */
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import spotifyAccessToken from "./spotifyAccessTokenSlice";
import { persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "./userSlice";
// import useLogout from '../hooks/useLogout';

const appReducer = combineReducers({
  spotifyAccessToken: spotifyAccessToken,
  user: userReducer,
});

const rootReducer = (state, action) => {
  //   if (action.type === useLogout) {
  //     return appReducer(undefined, action);
  //   }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
    }),
});

export const persistor = persistStore(store);
