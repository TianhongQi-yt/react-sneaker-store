import decode from "jwt-decode";

const JWT = "jwToken";

// 缓存 JWT到 localStorage
const setToken = (token) => {
  localStorage.setItem(JWT, token);
};

// 获取本地的 JWT
const getToken = () => {
  return localStorage.getItem(JWT);
};

// 是否登录
const isLogin = () => {
  const jwToken = getToken();
  return jwToken && !isTokenExpired(jwToken);
};

// JWT是否过期
const isTokenExpired = (token) => {
  try {
    const info = decode(token);
    return (info.exp < Date.now() / 1000) 
  } catch (error) {
    return false;
  }
};

// 获取用户信息(解码 JWT)
const getUser = () => {
  const jwToken = getToken();
  if (isLogin()) {
    const user = decode(jwToken);
    return user;
  } else {
    return null;
  }
};

// 登出(移除本地 JWT)
const logout = () => {
  localStorage.removeItem(JWT);
};

// 设置为全局变量
global.auth = {
  setToken,
  getToken,
  getUser,
  isLogin,
  logout,
};
