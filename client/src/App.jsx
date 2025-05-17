import React, { useEffect, useState } from "react";
import { Cart } from './components/Cart';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { getProducts, addProduct } from "./services/api";
// Import the test component
import TestConnection from "./TestConnection";
import "./index.css";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTest, setShowTest] = useState(false); // Changed to false to hide connection data initially

  async function fetchProducts() {
    try {
      setLoading(true);
      console.log("App: Fetching products...");
      const data = await getProducts();
      console.log("App: Products received:", data);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please check your connection.");
      console.error("App: Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleAddToCart(product) {
    setCart((prev) => {
      const found = prev.find((item) => item._id === product._id);
      if (found) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, product]; // Use product.quantity from ProductList
    });
  }

  function handleRemoveFromCart(id) {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }

  async function handleAddMedicine(newMedicine) {
    try {
      await addProduct(newMedicine);
      await fetchProducts(); // Refresh product list after adding
    } catch (error) {
      console.error("Failed to add medicine:", error);
      // You could set an error state here to show to the user
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-red-600">Pharmacy Management</h1>
        <button 
          onClick={() => setShowTest(!showTest)}
          className={`text-sm px-3 py-1 rounded font-medium transition-colors ${
            showTest 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          {showTest ? "Hide Connection Data" : "Show Connection Data"}
        </button>
      </header>

      {showTest && <TestConnection />}

      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {loading ? (
              <div className="text-center p-8">Loading products...</div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">{error}</div>
            ) : (
              <ProductList products={products} onAddToCart={handleAddToCart} />
            )}
            <div className="mt-6">
              <ProductForm onAdd={handleAddMedicine} />
            </div>
          </div>
          <div>
            <Cart cart={cart} onRemove={handleRemoveFromCart} />
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-inner border-t mt-6 p-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Pharmacy Management. All rights reserved.
      </footer>
    </div>
  );
}

export default App;