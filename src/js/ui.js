import { state, saveWishlist } from './state.js';
import { getFilteredProducts, getSearchSuggestions, setSearchQuery, setCategoryFilter, debounce } from './search.js';
import { addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartTotal } from './cart.js';
import { login, signup, logout, validateEmail } from './auth.js';
import { navigateTo, getRoute } from './router.js';

const app = document.getElementById('app');
const toastRoot = document.getElementById('toastRoot');
const offlineIndicator = document.getElementById('offlineIndicator');
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const installDismiss = document.getElementById('installDismiss');
let listenersInitialized = false;
let isSubmitting = false;
const debouncedSearch = debounce(value => {
  setSearchQuery(value);
  render();
}, 180);

const escapeHTML = value => String(value).replace(/[&<>"']/g, tag => {
  const escapeMap = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
  return escapeMap[tag] || tag;
});

const renderStars = rating => {
  const stars = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => {
    return `<span class="rating-star" aria-hidden="true">${index < stars ? '★' : '☆'}</span>`;
  }).join('');

};

const renderSearchDropdown = () => {
  const suggestions = getSearchSuggestions();
  if (!suggestions.length) {
    return '';
  }
  return `
    <div class="search-results" role="listbox">
      ${suggestions.map(item => `
        <button class="search-results__item" type="button" data-action="select-suggestion" data-id="${item.id}">
          <span>${escapeHTML(item.name)}</span>
          <span class="product-card__pill">${escapeHTML(item.category)}</span>
        </button>
      `).join('')}
    </div>
  `;
};

const renderHeader = () => {
  const cartCount = getCartCount();
  const userLabel = state.user ? `Hi, ${state.user.name}` : 'Login';
  const authView = state.user ? 'account' : 'login';

  return `
    <header class="site-header">
      <div class="site-header__inner page-width">
        <div class="brand">
          <div class="brand__mark">S</div>
          <div class="brand__text">
            <p class="brand__name">Scentify</p>
            <p class="brand__tag">Luxury fragrance boutique</p>
          </div>
        </div>
        <div class="search-bar">
          <span class="search-bar__icon">🔍</span>
          <input id="searchInput" class="search-bar__field" type="search" placeholder="Search perfumes, florals, woody notes..." value="${escapeHTML(state.filters.search)}" aria-label="Search perfumes" autocomplete="off" />
          ${renderSearchDropdown()}
        </div>
        <div class="nav-actions">
          <button class="button button--ghost" type="button" data-action="toggle-cart" aria-label="Open cart">
            🛒
            ${cartCount ? `<span class="cart-count">${cartCount}</span>` : ''}
          </button>
          <button class="button button--ghost" type="button" data-action="open-auth" data-view="${authView}">${escapeHTML(userLabel)}</button>
        </div>
      </div>
    </header>
  `;
};

const renderHero = () => `
  <section class="hero">
    <div class="hero__panel page-width">
      <div class="hero__content">
        <span class="hero__eyebrow">Limited edition collection</span>
        <h1 class="hero__title">Find your signature scent with effortless luxury.</h1>
        <p class="hero__copy">Explore premium fragrances, exclusive drops, and a smooth mobile-first experience that feels polished from first touch.</p>
        <div class="hero__actions">
          <button class="button button--primary" type="button" data-action="view-catalog">Shop best sellers</button>
          <button class="button button--ghost" type="button" data-action="open-auth" data-view="login">My account</button>
        </div>
      </div>
      <div class="hero__illustration">
        <div class="hero__card">
          <p class="hero__card-title">Free shipping over $70</p>
          <p class="hero__card-copy">Unlock exclusive offers and discover scents curated for every mood.</p>
          <span class="hero__badge">Top rated</span>
        </div>
      </div>
    </div>
  </section>
`;

const renderCategories = () => `
  <section class="section section--compact">
    <div class="page-width section__heading-group">
      <div>
        <h2 class="section-heading">Discover fragrances by mood</h2>
        <p class="section-copy">Select a category to refine your search and find the scent that complements your style.</p>
      </div>
    </div>
    <div class="categories">
      ${state.categories.map(category => `
        <button class="category-pill${state.filters.category === category ? ' is-active' : ''}" type="button" data-action="set-category" data-category="${escapeHTML(category)}">
          ${escapeHTML(category)}
        </button>
      `).join('')}
    </div>
  </section>
`;

const renderProductCard = product => {
  const isWishlisted = state.wishlist.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-card__media">
        <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy" />
        <span class="product-card__badge">${product.discount}% off</span>
        <button class="product-card__action" type="button" aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}" data-action="toggle-wishlist" data-id="${product.id}">
          ${isWishlisted ? '♥' : '♡'}
        </button>
      </div>
      <div class="product-card__meta">
        <span class="product-card__category">${escapeHTML(product.category)}</span>
        <span class="product-card__rating">${renderStars(product.rating)} ${product.rating.toFixed(1)}</span>
      </div>
      <h3 class="product-card__title">${escapeHTML(product.name)}</h3>
      <p class="product-card__sold">${product.sold}+ sold</p>
      <p class="product-card__copy">${escapeHTML(product.description)}</p>
      <div class="product-card__price">
        <span>$${product.price.toFixed(2)}</span>
        <span class="product-card__price--old">$${product.oldPrice.toFixed(2)}</span>
      </div>
      <div class="product-card__controls">
        <button class="product-card__button" type="button" data-action="add-to-cart" data-id="${product.id}">Add to cart</button>
        <span class="product-card__pill">${product.discount}%</span>
      </div>
    </article>
  `;
};

const renderProducts = () => {
  if (state.ui.loading) {
    return Array.from({ length: 6 }, () => `
      <article class="product-card skeleton" style="min-height:28rem;border-radius:1.85rem;"></article>
    `).join('');
  }

  const products = getFilteredProducts();
  if (!products.length) {
    return `
      <div class="empty-state">
        <h3>No perfumes found</h3>
        <p>Try adjusting your search or selecting a different category for more options.</p>
      </div>
    `;
  }

  return products.map(renderProductCard).join('');
};

const renderProductSection = () => {
  const productCount = getFilteredProducts().length;
  return `
    <section class="section">
      <div class="page-width section__heading-group">
        <div>
          <h2 class="section-heading">Best sellers</h2>
          <p class="section-copy">${productCount} premium perfumes ready to explore.</p>
        </div>
      </div>
      <div class="catalog-grid">
        ${renderProducts()}
      </div>
    </section>
  `;
};

const renderCartItem = item => `
  <div class="cart-item">
    <div class="cart-item__image"><img src="${item.image}" alt="${escapeHTML(item.name)}" loading="lazy" /></div>
    <div class="cart-item__meta">
      <p class="cart-item__title">${escapeHTML(item.name)}</p>
      <p class="cart-item__subtitle">$${item.price.toFixed(2)} each</p>
      <div class="quantity-control" data-product-id="${item.productId}">
        <button type="button" data-action="decrement" data-id="${item.productId}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increment" data-id="${item.productId}">+</button>
      </div>
    </div>
    <button class="cart-item__remove" type="button" data-action="remove-item" data-id="${item.productId}">Remove</button>
  </div>
`;

const renderCartDrawer = () => {
  const count = getCartCount();
  const total = getCartTotal();
  return `
    <aside class="cart-drawer${state.ui.cartOpen ? ' is-open' : ''}" id="cartDrawer" aria-hidden="${state.ui.cartOpen ? 'false' : 'true'}">
      <div class="cart-drawer__header">
        <div>
          <p class="section-heading" style="font-size:1.25rem;">Your cart</p>
          <p class="section-copy">${count} item${count === 1 ? '' : 's'} ready for checkout.</p>
        </div>
        <button class="button button--ghost" type="button" data-action="toggle-cart">Close</button>
      </div>
      <div class="cart-drawer__body">
        ${count ? state.cart.map(renderCartItem).join('') : `
          <div class="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add a fragrance to start a luxuriously simple checkout flow.</p>
          </div>
        `}
      </div>
      <div class="cart-drawer__footer">
        <div class="flex justify-between" style="margin-bottom:1rem;">
          <span class="text-muted">Subtotal</span>
          <strong>$${total.toFixed(2)}</strong>
        </div>
        <button class="button button--primary button--sm" type="button" data-action="checkout" ${count ? '' : 'disabled'}>Checkout now</button>
        <button class="button button--link button--sm" type="button" data-action="clear-cart">Clear cart</button>
      </div>
    </aside>
  `;
};

const renderAuthPanel = () => {
  if (state.ui.authView === 'none') {
    return '';
  }

  const view = state.ui.authView;
  const isAccount = view === 'account';

  return `
    <div class="auth-panel is-visible" id="authPanel">
      <div class="auth-panel__backdrop" data-action="close-auth"></div>
      <div class="auth-panel__content">
        <div class="form-panel">
          <div class="form-panel__switch">
            <button type="button" class="${view === 'login' ? 'is-active' : ''}" data-action="switch-auth" data-view="login">Login</button>
            <button type="button" class="${view === 'signup' ? 'is-active' : ''}" data-action="switch-auth" data-view="signup">Sign up</button>
          </div>
          ${isAccount ? renderAccountPanel() : renderAuthForm(view)}
        </div>
      </div>
    </div>
  `;
};

const renderAuthForm = view => {
  if (view === 'signup') {
    return `
      <h2 class="form-panel__heading">Create your account</h2>
      <form id="signupForm" class="flex-column">
        <label class="form-field">
          <span class="input-label">Full name</span>
          <input class="input-field" name="name" type="text" placeholder="Jane Doe" required />
        </label>
        <label class="form-field">
          <span class="input-label">Email address</span>
          <input class="input-field" name="email" type="email" placeholder="name@example.com" required />
        </label>
        <label class="form-field">
          <span class="input-label">Password</span>
          <input class="input-field" name="password" type="password" placeholder="Create password" required />
        </label>
        <label class="form-field">
          <span class="input-label">Confirm password</span>
          <input class="input-field" name="confirmPassword" type="password" placeholder="Repeat password" required />
        </label>
        <button class="button button--primary" type="submit">Create account</button>
      </form>
      <p class="auth-footer">Already registered? <button type="button" data-action="switch-auth" data-view="login">Login</button></p>
    `;
  }

  return `
    <h2 class="form-panel__heading">Welcome back</h2>
    <form id="loginForm" class="flex-column">
      <label class="form-field">
        <span class="input-label">Email address</span>
        <input class="input-field" name="email" type="email" placeholder="name@example.com" required />
      </label>
      <label class="form-field">
        <span class="input-label">Password</span>
        <input class="input-field" name="password" type="password" placeholder="Your password" required />
      </label>
      <button class="button button--primary" type="submit">Login</button>
    </form>
    <p class="auth-footer">New to Scentify? <button type="button" data-action="switch-auth" data-view="signup">Create account</button></p>
  `;
};

const renderAccountPanel = () => `
  <h2 class="form-panel__heading">Account</h2>
  <p class="section-copy">Signed in as <strong>${escapeHTML(state.user.name)}</strong> (${escapeHTML(state.user.email)})</p>
  <div class="form-field" style="margin-top:1.5rem;">
    <button class="button button--primary" type="button" data-action="logout">Sign out</button>
  </div>
`;

const renderBottomBar = () => `
  <section class="bottom-bar">
    <button class="bottom-bar__item" type="button" data-action="view-catalog">Explore</button>
    <button class="bottom-bar__item" type="button" data-action="toggle-cart">Cart (${getCartCount()})</button>
    <button class="bottom-bar__item" type="button" data-action="open-auth" data-view="${state.user ? 'account' : 'login'}">${state.user ? 'Account' : 'Login'}</button>
  </section>
`;

const renderApp = () => {
  return `${renderHeader()}${renderHero()}${renderCategories()}${renderProductSection()}${renderCartDrawer()}${renderAuthPanel()}${renderBottomBar()}`;
};

export const render = () => {
  if (!app) return;
  app.innerHTML = renderApp();
  updateOfflineIndicator();
  attachListeners();
};

const getActionButton = target => target.closest('[data-action]');

const handleClick = async event => {
  const button = getActionButton(event.target);
  if (!button) return;

  const action = button.dataset.action;
  const productId = button.dataset.id;
  const category = button.dataset.category;
  const view = button.dataset.view;

  switch (action) {
    case 'toggle-cart':
      state.ui.cartOpen = !state.ui.cartOpen;
      render();
      break;
    case 'open-auth':
      state.ui.authView = view || 'login';
      if (state.ui.authView === 'account' && !state.user) {
        state.ui.authView = 'login';
      }
      render();
      break;
    case 'view-catalog':
      navigateTo('#home');
      state.ui.cartOpen = false;
      state.ui.authView = 'none';
      render();
      break;
    case 'set-category':
      setCategoryFilter(category);
      render();
      break;
    case 'select-suggestion': {
      const suggestion = state.products.find(product => product.id === productId);
      if (suggestion) {
        setSearchQuery(suggestion.name);
        render();
      }
      break;
    }
    case 'add-to-cart':
      if (!state.user) {
        state.ui.authView = 'login';
        render();
        showToast('Please sign in to add items to your cart.', 'info');
        return;
      }
      addToCart(productId, 1);
      showToast('Added to cart', 'success');
      render();
      break;
    case 'toggle-wishlist':
      toggleWishlist(productId);
      render();
      break;
    case 'increment':
      updateQuantity(productId, 1);
      render();
      break;
    case 'decrement':
      updateQuantity(productId, -1);
      render();
      break;
    case 'remove-item':
      removeFromCart(productId);
      showToast('Item removed', 'info');
      render();
      break;
    case 'checkout':
      if (!state.cart.length) {
        showToast('Your cart is empty.', 'info');
        return;
      }
      clearCart();
      showToast('Checkout complete — thank you!', 'success');
      render();
      break;
    case 'clear-cart':
      clearCart();
      showToast('Cart cleared', 'info');
      render();
      break;
    case 'switch-auth':
      state.ui.authView = view;
      render();
      break;
    case 'close-auth':
      state.ui.authView = 'none';
      render();
      break;
    case 'logout':
      logout();
      state.ui.authView = 'none';
      showToast('Signed out successfully', 'info');
      render();
      break;
    case 'install-app':
      installButton?.click();
      break;
    case 'dismiss-install':
      state.ui.installPromptVisible = false;
      installPrompt?.classList.add('hidden');
      break;
    default:
      break;
  }
};

const handleInput = event => {
  if (event.target.id === 'searchInput') {
    debouncedSearch(event.target.value);
  }
};

const handleSubmit = async event => {
  if (event.target.id === 'loginForm' || event.target.id === 'signupForm') {
    if (isSubmitting) return;
    event.preventDefault();
    isSubmitting = true;
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const email = formData.get('email')?.toString().trim() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    if (!validateEmail(email) || password.length < 6) {
      showToast('Please enter valid credentials.', 'info');
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    if (form.id === 'signupForm') {
      const name = formData.get('name')?.toString().trim() ?? '';
      const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

      if (!name) {
        showToast('Enter a full name to create your account.', 'info');
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'info');
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      try {
        await signup({ name, email, password });
        state.ui.authView = 'none';
        showToast('Welcome to Scentify!', 'success');
        render();
      } catch (error) {
        showToast(error.message, 'info');
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
      }
      return;
    }

    try {
      await login({ email, password });
      state.ui.authView = 'none';
      showToast(`Welcome back, ${state.user.name}!`, 'success');
      render();
    } catch (error) {
      showToast(error.message, 'info');
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }
};

const handleKeydown = event => {
  if (event.key === 'Escape') {
    if (state.ui.cartOpen || state.ui.authView !== 'none') {
      state.ui.cartOpen = false;
      state.ui.authView = 'none';
      render();
    }
  }
};

const toggleWishlist = productId => {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    state.wishlist.push(productId);
    showToast('Added to wishlist', 'success');
  }
  saveWishlist();
};

export const updateOfflineIndicator = () => {
  if (!offlineIndicator) return;
  offlineIndicator.classList.toggle('hidden', !state.ui.offline);
};

export const setInstallPrompt = event => {
  state.ui.installPromptVisible = true;
  installPrompt?.classList.remove('hidden');
  installButton?.addEventListener('click', async () => {
    event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted') {
      showToast('App installed successfully', 'success');
    }
    installPrompt?.classList.add('hidden');
  }, { once: true });
};

export const initPWAListener = event => {
  if (!event) return;
  event.preventDefault();
  state.ui.installPromptVisible = true;
  installPrompt?.classList.remove('hidden');
  if (installButton) {
    installButton.dataset.action = 'install-app';
  }
  if (installDismiss) {
    installDismiss.dataset.action = 'dismiss-install';
  }
};

export const showToast = (message, type = 'info') => {
  if (!toastRoot) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__message">${escapeHTML(message)}</span>`;
  toastRoot.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
};

export const attachListeners = () => {
  if (listenersInitialized) return;
  document.body.addEventListener('click', handleClick);
  document.body.addEventListener('input', handleInput);
  document.body.addEventListener('submit', handleSubmit);
  document.body.addEventListener('keydown', handleKeydown);
  listenersInitialized = true;
};
