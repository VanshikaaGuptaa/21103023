// AllProductsPage.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterOptions from '../components/FilterOptions';
import axios from 'axios';

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>All Products</h1>
      <FilterOptions />
      <div className="products-container">
        {products.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default AllProductsPage;
