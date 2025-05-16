const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}