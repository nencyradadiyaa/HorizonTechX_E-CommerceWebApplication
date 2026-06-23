import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        // If it exists, update quantity up to its stock limit
        return prevItems.map((x) =>
          x.product === product._id
            ? { ...x, qty: Math.min(product.stock, x.qty + qty) }
            : x
        );
      } else {
        // Otherwise add new item
        return [
          ...prevItems,
          {
            product: product._id,
            title: product.title,
            image: product.image,
            price: product.price,
            stock: product.stock,
            qty: Math.min(product.stock, qty),
          },
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  // Update Item Quantity
  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate stats
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
