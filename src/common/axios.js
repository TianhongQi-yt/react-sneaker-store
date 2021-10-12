import _axios from "axios";

const axios = (baseURL) => {
  const instance = _axios.create({
    baseURL: baseURL || "http://localhost:3001",
    timeout: 1000,
  });

  // 拦截器（请求验证 JWT）
  instance.interceptors.request.use(
    (config) => {
      const jwToken = global.auth.getToken();
      // 设置 http头部字段为后端验证的字段
      config.headers.Authorization = "Bearer " + jwToken;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};

// 默认无参导出
export default axios();

// 有参导出
export { axios };
