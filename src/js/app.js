import { state } from './state.js';
import { products, getCategories } from './products.js';
import { initRouter, getRoute } from './router.js';
import { render, initPWAListener, updateOfflineIndicator, showToast } from './ui.js';

const handleRoute = route => {
  if (route === '#login' || route === '#signup') {
    state.ui.authView = route.slice(1);
  } else if (route === '#account') {
    state.ui.authView = state.user ? 'account' : 'login';
  } else {
    state.ui.authView = 'none';
  }
  render();
};

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered');
  } catch (error) {
    console.warn('Service worker registration failed', error);
  }
};

const initApp = () => {
  state.products = products;
  state.categories = ['All', ...getCategories()];
  state.ui.loading = false;
  state.ui.offline = !navigator.onLine;
  render();

  initRouter(route => handleRoute(route || getRoute()));

  window.addEventListener('online', () => {
    state.ui.offline = false;
    updateOfflineIndicator();
    showToast('You are back online', 'success');
  });

  window.addEventListener('offline', () => {
    state.ui.offline = true;
    updateOfflineIndicator();
    showToast('Offline mode activated', 'info');
  });

  window.addEventListener('beforeinstallprompt', event => initPWAListener(event));
  window.addEventListener('appinstalled', () => showToast('Scentify installed successfully', 'success'));
  registerServiceWorker();
};

initApp();
