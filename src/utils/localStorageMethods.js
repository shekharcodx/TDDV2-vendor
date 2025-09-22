import Cookies from "js-cookie";

const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

const setObjectInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
};

const getSingleItem = (key) => {
  return localStorage.getItem(key);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const setToken = (token) => {
  Cookies.set("vendor-token", token, { expires: 1 });
};

const getToken = () => {
  return Cookies.get("vendor-token") || null;
};

const removeToken = () => {
  Cookies.remove("vendor-token");
  Cookies.remove("vendorRefreshToken");
};

const setUser = (user) => {
  Cookies.set("user-vendor", user, { expires: 1 });
};

const getUser = () => {
  return Cookies.get("user-vendor") || null;
};

const removeUser = () => {
  Cookies.remove("user-vendor");
};

const setUserRole = (role) => {
  Cookies.set("vendor-role", role.toString(), { expires: 1 });
};

const getUserRole = () => {
  const role = Cookies.get("vendor-role");
  return role ? parseInt(role, 10) : null;
};

const removeUserRole = () => {
  Cookies.remove("vendor-role");
};

export {
  setItem,
  getItem,
  getSingleItem,
  setObjectInLocalStorage,
  removeItem,
  setToken,
  getToken,
  setUser,
  getUser,
  removeUser,
  removeToken,
  setUserRole,
  getUserRole,
  removeUserRole,
};
