// Add this file to debug API connection issues

import React, { useState, useEffect } from "react";
import { getProducts } from "./services/api";

function TestConnection() {
  const [status, setStatus] = useState("Checking connection...");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Direct fetch to API root to test connection
        const rootResponse = await fetch("http://localhost:5001/");
        if (rootResponse.ok) {
          setStatus(`Server connection test: OK (${rootResponse.status})`);
        } else {
          setStatus(`Server connection test: Failed (${rootResponse.status})`);
        }
        
        // Test products endpoint
        try {
          console.log("Fetching products...");
          const productsData = await getProducts();
          console.log("Products response:", productsData);
          
          if (Array.isArray(productsData)) {
            setProducts(productsData);
            setStatus(prev => `${prev}\nProducts endpoint: OK (${productsData.length} products)`);
          } else {
            setStatus(prev => `${prev}\nProducts endpoint: Returns non-array: ${JSON.stringify(productsData).substring(0, 100)}`);
          }
        } catch (productsError) {
          console.error("Error testing products endpoint:", productsError);
          setStatus(prev => `${prev}\nProducts endpoint error: ${productsError.message}`);
        }
      } catch (e) {
        console.error("Connection test error:", e);
        setError(e.message);
        setStatus(`Connection failed: ${e.message}`);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Connection Test</h2>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '10px' }}>
        {status}
        {error && `\n\nError: ${error}`}
      </pre>
      
      <h3>Products Data:</h3>
      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={product._id || index}>
              {product.name} - {product.price} (Stock: {product.stock})
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
      
      <h3>Browser Console</h3>
      <p>Please open your browser console (F12) to see detailed request/response logs</p>
    </div>
  );
}

export default TestConnection;