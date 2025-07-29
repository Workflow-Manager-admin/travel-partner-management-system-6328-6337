export function loadToken() {
  return localStorage.getItem("authToken");
}

export function authHeader() {
  const token = loadToken();
  return token ? { Authorization: "Bearer " + token } : {};
}
