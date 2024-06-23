// bottomBarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const bottomBarSlice = createSlice({
  name: 'bottomBar',
  initialState: {
    isVisible: true,
  },
  reducers: {
    setBottomBarVisibility: (state, action) => {
      state.isVisible = action.payload;
    },
  },
});

export const { setBottomBarVisibility } = bottomBarSlice.actions;
export default bottomBarSlice.reducer;