import { state } from './state.js';

export const debounce = (callback, delay = 250) => {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
};

export const setSearchQuery = query => {
  state.filters.search = query;
};

export const setCategoryFilter = category => {
  state.filters.category = category;
};

export const getFilteredProducts = () => {
  const query = state.filters.search.trim().toLowerCase();
  const category = state.filters.category;
  let result = [...state.products];

  if (category && category !== 'All') {
    result = result.filter(item => item.category === category);
  }

  if (query) {
    result = result.filter(item => {
      return [item.name, item.category, item.description]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }

  return result;
};

export const getSearchSuggestions = () => {
  if (!state.filters.search.trim()) {
    return [];
  }
  return getFilteredProducts().slice(0, 5);
};
