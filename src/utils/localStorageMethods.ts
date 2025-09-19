import Cookies from "js-cookie";

const setItem = (key: string, value: string | number): void => {
  localStorage.setItem(key, String(value));
};

const setObjectInLocalStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = <T>(key: string): T | null => {
  const val = localStorage.getItem(key);
  return val ? (JSON.parse(val) as T) : null;
};

const getSingleItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

const setToken = (token: string): void => {
  Cookies.set("vendor-token", token, { expires: 1 });
};

const getToken = (): string | null => {
  return Cookies.get("vendor-token") || null;
};

const removeToken = () => {
  Cookies.remove("vendor-token");
};

const setUser = (user: string): void => {
  Cookies.set("user-vendor", user, { expires: 1 });
};

const getUser = (): string | null => {
  return Cookies.get("user-vendor") || null;
};

const removeUser = () => {
  Cookies.remove("user-vendor");
};

const setUserRole = (role: number): void => {
  Cookies.set("vendor-role", role.toString(), { expires: 1 });
};

const getUserRole = (): number | null => {
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
