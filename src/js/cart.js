import { state, saveCart } from './state.js';
import { findProduct } from './products.js';

export const addToCart = (productId, quantity = 1) => {
  const product = findProduct(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 9);
  } else {
    state.cart.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Math.min(quantity, 9),
      discount: product.discount
    });
  }
  saveCart();
};

export const updateQuantity = (productId, amount) => {
  const item = state.cart.find(cartItem => cartItem.productId === productId);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(item.quantity + amount, 9));
  saveCart();
};

export const setQuantity = (productId, quantity) => {
  const item = state.cart.find(cartItem => cartItem.productId === productId);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(quantity, 9));
  saveCart();
};

export const removeFromCart = productId => {
  state.cart = state.cart.filter(item => item.productId !== productId);
  saveCart();
};

export const clearCart = () => {
  state.cart = [];
  saveCart();
};

export const getCartCount = () => state.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getCartTotal = () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
