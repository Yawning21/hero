import { storage } from './storage.js';
import { state, saveUser } from './state.js';

const USERS_KEY = 'scentify-users';
const authDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getUsers = () => storage.get(USERS_KEY, []);
const saveUsers = users => storage.set(USERS_KEY, users);

export const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const signup = async ({ name, email, password }) => {
  await authDelay(300);
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  if (users.some(user => user.email === normalizedEmail)) {
    throw new Error('This email is already registered.');
  }
  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password
  };
  users.push(newUser);
  saveUsers(users);
  state.user = { id: newUser.id, name: newUser.name, email: newUser.email };
  saveUser();
  return state.user;
};

export const login = async ({ email, password }) => {
  await authDelay(300);
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(item => item.email === normalizedEmail && item.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  state.user = { id: user.id, name: user.name, email: user.email };
  saveUser();
  return state.user;
};

export const logout = () => {
  state.user = null;
  saveUser();
};
