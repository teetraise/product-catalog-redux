import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Симуляция API для демонстрации асинхронных действий
const mockApi = {
  fetchProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 999,
            category: 'Смартфоны',
            description: 'Новейший iPhone с процессором A17 Pro',
            image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=iPhone+15+Pro',
            inStock: true,
          },
          {
            id: 2,
            name: 'MacBook Air M2',
            price: 1199,
            category: 'Ноутбуки',
            description: 'Легкий и мощный ноутбук с чипом M2',
            image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=MacBook+Air',
            inStock: true,
          },
          {
            id: 3,
            name: 'AirPods Pro',
            price: 249,
            category: 'Аудио',
            description: 'Беспроводные наушники с шумоподавлением',
            image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=AirPods+Pro',
            inStock: false,
          },
        ]);
      }, 1000);
    });
  },
  addProduct: (product) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...product, id: Date.now() });
      }, 500);
    });
  },
  updateProduct: (product) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(product);
      }, 500);
    });
  },
  deleteProduct: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
  },
};

// Асинхронные действия
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await mockApi.fetchProducts();
    return response;
  }
);

export const addProductAsync = createAsyncThunk(
  'products/addProduct',
  async (productData) => {
    const response = await mockApi.addProduct(productData);
    return response;
  }
);

export const updateProductAsync = createAsyncThunk(
  'products/updateProduct',
  async (productData) => {
    const response = await mockApi.updateProduct(productData);
    return response;
  }
);

export const deleteProductAsync = createAsyncThunk(
  'products/deleteProduct',
  async (productId) => {
    await mockApi.deleteProduct(productId);
    return productId;
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: {
    category: 'all',
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  cache: {
    lastFetch: null,
    ttl: 5 * 60 * 1000, // 5 минут
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cache.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.cache.lastFetch = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add product
      .addCase(addProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update product
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilter, clearError, clearCache } = productsSlice.actions;

// Селекторы
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsFilter = (state) => state.products.filter;
export const selectProductsCache = (state) => state.products.cache;

// Селектор для фильтрованных и отсортированных товаров
export const selectFilteredProducts = (state) => {
  const { items, filter } = state.products;
  const { category, searchTerm, sortBy, sortOrder } = filter;

  let filtered = items;

  // Фильтр по категории
  if (category !== 'all') {
    filtered = filtered.filter(product => product.category === category);
  }

  // Поиск по названию
  if (searchTerm) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Сортировка
  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
};

// Селектор для категорий
export const selectCategories = (state) => {
  const categories = [...new Set(state.products.items.map(product => product.category))];
  return ['all', ...categories];
};

export default productsSlice.reducer;