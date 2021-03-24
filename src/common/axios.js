import _axios from "axios";

// 通过创建 axios实例使用
const axios = (baseURL) => {
  const instance = _axios.create({
    // 使用传递的参数或默认值
    baseURL: baseURL || "http://localhost:3001",
    timeout: 1000,
  });

  // 拦截器，每次请求验证 JWT
  instance.interceptors.request.use(
    (config) => {
      const jwToken = global.auth.getToken();
      // 设置 http头部字段为后端验证的字段
      config.headers.Authorization = "Bearer " + jwToken;
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  return instance;
};

// 到处传参形式
export { axios };

// 默认导出无参形式
export default axios();
