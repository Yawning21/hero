export const getRoute = () => location.hash || '#home';

export const navigateTo = hash => {
  if (location.hash !== hash) {
    location.hash = hash;
  }
};

export const initRouter = callback => {
  window.addEventListener('hashchange', () => callback(getRoute()));
  callback(getRoute());
};
