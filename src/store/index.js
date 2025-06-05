import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import themeReducer from './slices/themeSlice';
import { loadState, saveState } from '../utils/localStorage';

// Загружаем состояние из localStorage
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    theme: themeReducer,
  },
  preloadedState: persistedState,
});

// Сохраняем состояние в localStorage при каждом изменении
store.subscribe(() => {
  saveState({
    products: store.getState().products,
    theme: store.getState().theme,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;