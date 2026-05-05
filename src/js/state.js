import { storage } from './storage.js';

const persistedCart = storage.get('scentify-cart', []);
const persistedUser = storage.get('scentify-user', null);
const persistedWishlist = storage.get('scentify-wishlist', []);
const persistedTheme = storage.get('scentify-theme', 'light');

export const state = {
  user: persistedUser,
  cart: persistedCart,
  wishlist: persistedWishlist,
  theme: persistedTheme,
  products: [],
  categories: [],
  filters: {
    search: '',
    category: 'All'
  },
  ui: {
    cartOpen: false,
    authView: 'none',
    installPromptVisible: false,
    offline: !navigator.onLine,
    loading: true
  }
};

export const saveCart = () => storage.set('scentify-cart', state.cart);
export const saveUser = () => storage.set('scentify-user', state.user);
export const saveWishlist = () => storage.set('scentify-wishlist', state.wishlist);
export const saveTheme = () => storage.set('scentify-theme', state.theme);
