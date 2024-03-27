import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllProductsPage from './pages/AllProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

