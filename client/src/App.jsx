import React, { useState } from "react";
import { Cart } from './components/Cart';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import "./index.css";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

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
      return [...prev, product];
    });
  }

  function handleRemoveFromCart(id) {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }

  function handleAddMedicine(newMedicine) {
    // Generate a fake unique _id for each new product
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const medicineWithId = { ...newMedicine, _id: id };
    // Add to the top of the list
    setProducts((prev) => [medicineWithId, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-red-600">Pharmacy Management</h1>
      </header>
      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProductList products={products} onAddToCart={handleAddToCart} />
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