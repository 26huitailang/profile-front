// export function apiBase() {
//   let hostname = window.location.hostname;
//   let API_BASE_URL = 'http://localhost:8000';  //默认环境
//   if (hostname === 'production.com') {  //正式环境
//     API_BASE_URL = 'http://production.com';
//   } else if (hostname === 'test.production.com') {  //公网测试环境
//     API_BASE_URL = 'http://test.production.com';
//   } else if (hostname === 'develop.com') {  //内网测试环境
//     API_BASE_URL = 'http://develop.com';
//   }
//   return API_BASE_URL;
// }
export function apiBase() {
  return process.env.VUE_APP_API_ROOT;
}

export function wsBase() {
  return process.env.VUE_APP_WS_ROOT;
}

export function apiV1() {
  return apiBase() + "/api/v1";
}

export function AUTH() {
  return {
    TokenAuth: apiBase() + "/api-token-auth/",
    Login: apiV1() + "/auth/login/",
    Logout: apiV1() + "/auth/logout/"
  };
}

export function ApiGoods() {
  return {
    Goods: apiV1() + "/goods"
  };
}
