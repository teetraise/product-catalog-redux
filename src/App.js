import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import {
  fetchProducts,
  addProductAsync,
  updateProductAsync,
  deleteProductAsync,
  setFilter,
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsFilter,
  selectCategories,
  selectProductsCache,
  clearError,
} from './store/slices/productsSlice';
import { selectIsDarkMode } from './store/slices/themeSlice';
import ProductCard from './components/ProductCard/ProductCard';
import ProductForm from './components/ProductForm/ProductForm';
import ProductFilters from './components/ProductFilters/ProductFilters';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filter = useAppSelector(selectProductsFilter);
  const categories = useAppSelector(selectCategories);
  const cache = useAppSelector(selectProductsCache);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Загружаем товары при первом запуске или если кэш устарел
    const shouldFetch = !cache.lastFetch || 
      (Date.now() - cache.lastFetch > cache.ttl);
    
    if (shouldFetch) {
      dispatch(fetchProducts());
    }
  }, [dispatch, cache]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await dispatch(deleteProductAsync(productId)).unwrap();
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
      }
    }
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await dispatch(updateProductAsync(productData)).unwrap();
      } else {
        await dispatch(addProductAsync(productData)).unwrap();
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handleClearFilters = () => {
    dispatch(setFilter({
      category: 'all',
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc',
    }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Каталог товаров</h1>
            <p className="app-subtitle">Управление товарами с Redux</p>
          </div>
          <div className="header-right">
            <ThemeToggle />
            <button 
              className="btn btn-primary add-product-btn"
              onClick={handleAddProduct}
            >
              + Добавить товар
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span>Ошибка: {error}</span>
              <button onClick={handleClearError} className="error-close">×</button>
            </div>
          )}

          <ProductFilters
            filter={filter}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {loading && products.length === 0 ? (
            <LoadingSpinner size="large" text="Загрузка товаров..." />
          ) : (
            <>
              <div className="products-header">
                <h2>Товары ({products.length})</h2>
                {loading && (
                  <div className="inline-loading">
                    <LoadingSpinner size="small" text="" />
                  </div>
                )}
              </div>

              {products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>Товары не найдены</h3>
                  <p>Попробуйте изменить фильтры или добавить новый товар</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddProduct}
                  >
                    Добавить первый товар
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={loading}
        />
      )}
    </div>
  );
}

export default App;
