// ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Company: {product.company}</p>
      <p>Price: ${product.price}</p>
      <p>Rating: {product.rating}</p>
      <Link to={`/product/${product.productId}`}>View Details</Link>
    </div>
  );
}

export default ProductCard;
