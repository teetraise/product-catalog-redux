import React from 'react';
import './ProductFilters.css';

const ProductFilters = ({ 
  filter, 
  categories, 
  onFilterChange, 
  onClearFilters 
}) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Фильтры и поиск</h3>
        <button 
          className="clear-filters-btn"
          onClick={handleClearFilters}
          title="Очистить все фильтры"
        >
          Очистить
        </button>
      </div>

      <div className="filters-content">
        {/* Поиск */}
        <div className="filter-group">
          <label htmlFor="search">Поиск</label>
          <div className="search-input-container">
            <input
              type="text"
              id="search"
              placeholder="Поиск по названию или описанию..."
              value={filter.searchTerm}
              onChange={(e) => handleInputChange('searchTerm', e.target.value)}
              className="search-input"
            />
            <div className="search-icon">
              🔍
            </div>
          </div>
        </div>

        {/* Категория */}
        <div className="filter-group">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={filter.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Все категории' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Сортировка */}
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="sortBy">Сортировать по</label>
            <select
              id="sortBy"
              value={filter.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="name">Названию</option>
              <option value="price">Цене</option>
              <option value="category">Категории</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortOrder">Порядок</label>
            <select
              id="sortOrder"
              value={filter.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="filter-select"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;