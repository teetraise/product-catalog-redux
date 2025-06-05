import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getPlaceholderImage = () => {
    const colors = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1'];
    const color = colors[product.id % colors.length];
    return `https://via.placeholder.com/300x200/${color}/ffffff?text=${encodeURIComponent(product.name)}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageError ? getPlaceholderImage() : product.image}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
        <div className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'В наличии' : 'Нет в наличии'}
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price}</div>
      </div>
      
      <div className="product-actions">
        <button 
          className="btn btn-primary"
          onClick={() => onEdit(product)}
        >
          Редактировать
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => onDelete(product.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default ProductCard;