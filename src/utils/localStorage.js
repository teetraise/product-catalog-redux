// Утилиты для работы с localStorage

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('productCatalogState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Ошибка при загрузке состояния из localStorage:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('productCatalogState', serializedState);
  } catch (err) {
    console.warn('Ошибка при сохранении состояния в localStorage:', err);
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem('productCatalogState');
  } catch (err) {
    console.warn('Ошибка при очистке localStorage:', err);
  }
};