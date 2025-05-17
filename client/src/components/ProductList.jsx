import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Info,
  Syringe,
  HeartPulse,
  ShieldCheck,
  Pill,
  Stethoscope,
  Trash2
} from "lucide-react";

import "../App.css";

export function ProductList({ products, onAddToCart }) {
  const [productList, setProductList] = useState(products);

  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product._id] = 1;
      return acc;
    }, {})
  );

  function handleQuantityChange(id, change) {
    setQuantities((prev) => {
      const next = Math.max(1, (prev[id] || 1) + change);
      return { ...prev, [id]: next };
    });
  }

  function handleAdd(product) {
    onAddToCart({
      ...product,
      quantity: quantities[product._id],
    });
  }

  function handleRemove(productId) {
    setProductList((prevList) =>
      prevList.filter((product) => product._id !== productId)
    );
  }

  const categoryIcons = {
    Antibiotics: <Syringe className="w-8 h-8 text-blue-500" />,
    Painkillers: <HeartPulse className="w-8 h-8 text-red-500" />,
    Vitamins: <Stethoscope className="w-8 h-8 text-yellow-500" />,
    General: <ShieldCheck className="w-8 h-8 text-green-500" />,
    Default: <Pill className="w-8 h-8 text-gray-500" />,
  };

  return (
    <div className="productlist" style={{ color: "blue" }}>
      <div className="productlist__header">
        <div className="productlist__title">Available Medicines</div>
        <div className="productlist__filter">
          <span>All Categories</span>
        </div>
      </div>

      {productList.length === 0 ? (
        <div className="productlist__empty">
          <div className="productlist__empty-icon">
            <ShoppingCart size={48} />
          </div>
          <div className="productlist__empty-text">No Medicines Available</div>
          <small>Add some medicines to get started with your inventory.</small>
        </div>
      ) : (
        <div className="productlist__grid">
          {productList.map((product) => (
            <div
              key={product._id}
              className={`productcard ${
                Number(product.stock) < 10 ? "productcard--lowstock" : ""
              }`}
            >
              {Number(product.stock) < 10 && (
                <div className="productcard__lowstock">Low Stock</div>
              )}

              <div className="productcard__image flex items-center justify-center h-16">
                {categoryIcons[product.category] || categoryIcons.Default}
              </div>

              <div className="productcard__main">
                <div className="productcard__content">
                  <div className="productcard__name">{product.name}</div>
                  <div className="productcard__price">Rs. {product.price}</div>

                  <div className="productcard__info">
                    <span>
                      <Info size={14} /> Stock: {product.stock}
                    </span>
                    <span>Exp: {product.expiry}</span>
                  </div>

                  <div className="productcard__info productcard__manufacturer">
                    <span>{product.manufacturer || "Unknown Manufacturer"}</span>
                    <span className="productcard__category">
                      {product.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="productcard__actions">
                  <div className="productcard__qty">
                    <button
                      type="button"
                      className="productcard__qty-btn"
                      onClick={() => handleQuantityChange(product._id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="productcard__qty-value">
                      {quantities[product._id] || 1}
                    </span>
                    <button
                      type="button"
                      className="productcard__qty-btn"
                      onClick={() => handleQuantityChange(product._id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="productcard__add"
                      onClick={() => handleAdd(product)}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      className="productcard__remove"
                      style={{
                        backgroundColor: "#e53e3e",
                        color: "white",
                        padding: "6px 10px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() => handleRemove(product._id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
