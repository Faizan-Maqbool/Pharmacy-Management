// Update API endpoint to match server port in docker-compose.yml and index.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Add error handling to fetch requests
export async function getProducts() {
  try {
    console.log("Fetching from:", `${API_URL}/products`);
    const res = await fetch(`${API_URL}/products`);
    
    console.log("Response status:", res.status);
    
    if (!res.ok) {
      console.error("Failed response:", res.statusText);
      throw new Error(`Error fetching products: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array to prevent app crashing
  }
}

export async function addProduct(product) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      throw new Error(`Error adding product: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Re-throw for handling in component
  }
}