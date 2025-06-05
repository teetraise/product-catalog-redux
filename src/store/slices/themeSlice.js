import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light', // 'light' или 'dark'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

// Селекторы
export const selectTheme = (state) => state.theme.mode;
export const selectIsDarkMode = (state) => state.theme.mode === 'dark';

export default themeSlice.reducer;