import React, { useEffect, useState } from "react";
import { Cart } from './components/Cart';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { getProducts, addProduct } from "./services/api";
import "./index.css";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  async function fetchProducts() {
    const data = await getProducts();
    setProducts(data);
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
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function handleRemoveFromCart(id) {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }

  async function handleAddMedicine(newMedicine) {
    await addProduct(newMedicine);
    fetchProducts();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-red-600">Pharmacy Management</h1>
      </header>
      <main className="max-w-5xl mx-auto py-8 px-4">
        <ProductList products={products} onAddToCart={handleAddToCart} />
        <Cart cart={cart} onRemove={handleRemoveFromCart} />
        <ProductForm onAdd={handleAddMedicine} />
      </main>
      <footer className="bg-white shadow-inner border-t mt-6 p-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Pharmacy Management. All rights reserved.
      </footer>
    </div>
  );
}

export default App;