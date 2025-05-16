//ProductForm.jsx
import React, { useState } from "react";
import { Calendar, Package2, Pill, Building, Tag } from "lucide-react";
import "../App.css";

export function ProductForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "",
    expiry: "",
    category: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.expiry) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    onAdd(form);
    setForm({
      name: "",
      price: "",
      stock: "",
      manufacturer: "",
      expiry: "",
      category: "",
    });
  }

  const categories = ["Antibiotics", "Painkillers", "Vitamins", "General"];

  return (
    <form className="productform" onSubmit={handleSubmit}>
      <div className="productform__header">
        <div className="productform__title">Add New Medicine</div>
        <div className="productform__subtitle">Complete the form below to add a new medicine to your inventory</div>
      </div>
      <div className="productform__fields">
        <div className="productform__field">
          <label htmlFor="name">Medicine Name <span className="required">*</span></label>
          <div className="input-with-icon">
            <Pill size={18} className="input-icon" />
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter medicine name"
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="productform__field">
          <label htmlFor="price">Price <span className="required">*</span></label>
          <div className="input-with-icon">
            <span className="input-icon currency-symbol">₹</span>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              min={1}
            />
          </div>
        </div>
        
        <div className="productform__field">
          <label htmlFor="stock">Stock <span className="required">*</span></label>
          <div className="input-with-icon">
            <Package2 size={18} className="input-icon" />
            <input
              id="stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Enter available stock"
              min={0}
            />
          </div>
        </div>
        
        <div className="productform__field">
          <label htmlFor="manufacturer">Manufacturer</label>
          <div className="input-with-icon">
            <Building size={18} className="input-icon" />
            <input
              id="manufacturer"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer name"
            />
          </div>
        </div>
        
        <div className="productform__field">
          <label htmlFor="expiry">Expiry Date <span className="required">*</span></label>
          <div className="input-with-icon">
            <Calendar size={18} className="input-icon" />
            <input
              id="expiry"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YYYY"
            />
          </div>
        </div>
        
        <div className="productform__field">
          <label htmlFor="category">Category</label>
          <div className="input-with-icon">
            <Tag size={18} className="input-icon" />
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {error && <div className="productform__error">{error}</div>}
      
      <div className="productform__actions">
        <button className="productform__reset" type="reset" onClick={() => setForm({
          name: "",
          price: "",
          stock: "",
          manufacturer: "",
          expiry: "",
          category: "",
        })}>
          Reset
        </button>
        <button className="productform__submit" type="submit">Add Medicine</button>
      </div>
    </form>
  );
}