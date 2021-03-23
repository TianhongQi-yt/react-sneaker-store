import _axios from "axios";

// 通过创建 axios实例使用
const axios = (baseURL) => {
  const instance = _axios.create({
    // 使用传递的参数或默认值
    baseURL: baseURL || "http://localhost:3001",
    timeout: 1000,
  });
  return instance;
};

// 到处传参形式
export { axios };

// 默认导出无参形式
export default axios();
