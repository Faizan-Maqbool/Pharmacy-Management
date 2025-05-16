// This component is responsible for displaying the cart, including the items in the cart, their quantities, and the total price.
import React, { useState } from "react";
import { ShoppingCart, X, ChevronDown, ChevronUp } from "lucide-react";
import "../App.css";

export function Cart({ cart, onRemove }) {
  const [isOpen, setIsOpen] = useState(true);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart">
      <div className="cart__header" onClick={() => setIsOpen((open) => !open)}>
        <span className="cart__title">
          <ShoppingCart size={20} className="cart__icon" />
          <span>Your Cart</span>
        </span>
        <div className="cart__toggle">
          <span className="cart__count">{cart.length} items</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      {isOpen && (
        <div className="cart__body">
          {cart.length === 0 ? (
            <div className="cart__empty">
              <ShoppingCart size={48} className="cart__empty-icon" />
              <div className="cart__empty-text">Your cart is empty</div>
              <small>Add products to see them here</small>
            </div>
          ) : (
            <>
              <ul className="cart__list">
                {cart.map((item) => (
                  <li key={item._id} className="cart__item">
                    <div className="cart__item__details">
                      <div className="cart__item__img">
                        <img src={`/api/placeholder/40/40`} alt={item.name} />
                      </div>
                      <div>
                        <div className="cart__item__name">{item.name}</div>
                        <div className="cart__item__qty">
                          Rs. {item.price} × {item.quantity || 1}
                        </div>
                      </div>
                    </div>
                    <div className="cart__item__controls">
                      <span className="cart__item__total">Rs. {Number(item.price) * (item.quantity || 1)}</span>
                      <button
                        className="cart__remove"
                        onClick={() => onRemove(item._id)}
                        aria-label="Remove"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart__summary">
                <div className="cart__summary__row">
                  <span>Subtotal</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="cart__summary__row">
                  <span>Shipping</span>
                  <span>Rs. 0</span>
                </div>
                <div className="cart__summary__row cart__summary__total">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
                
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}