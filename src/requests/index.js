import axios from "axios";
import router from "../router";
import { apiV1 } from "./api.js";

// 创建axios实例
const service = axios.create({
  baseURL: apiV1(),
  timeout: 10000, // 请求超时时间
  withCredentials: false // 允许携带cookie
});

// 添加request拦截器
service.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    // if (config.url.indexOf("api-token-auth") < 0) {
    //   config.headers.Authorization = "Token " + token;
    // }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// 添加respone拦截器
service.interceptors.response.use(
  response => {
    let res = {};
    res.status = response.status;
    res.data = response.data.data;
    res.info = response.data.info;
    res.headers = response.headers;
    return res;
  },
  error => {
    if (error.response) {
      if (error.response.status === 404) {
        router.push("/404");
      } else if (error.response.status === 403) {
        // DRF session authentication 返回的是403
        if (
          error.response.data.detail ===
          "Authentication credentials were not provided."
        ) {
          router.push("/login");
        }
      } else if (error.response.status === 401) {
        // token 认证
        router.push("/login");
      }
      return Promise.reject(error.response);
    }
  }
);

export function get(url, params = {}) {
  params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return service({
    url: url,
    method: "get",
    headers: {},
    params
  });
}

//封装post请求
export function post(url, data = {}) {
  //默认配置
  let sendObject = {
    url: url,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    data: data
  };
  sendObject.data = JSON.stringify(data);
  return service(sendObject);
}

//封装put方法 (resfulAPI常用)
export function put(url, data = {}) {
  return service({
    url: url,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    data: JSON.stringify(data)
  });
}

//删除方法(resfulAPI常用)
export function _delete(url) {
  return service({
    url: url,
    method: "delete",
    headers: {}
  });
}

//不要忘记export
export { service };
