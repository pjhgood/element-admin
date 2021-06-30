import request from "@/utils/request";

// 登录
export function login(data) {
  return request({
    url: "/sewage-ums/userInfo/login",
    method: "post",
    data
  });
}

// 获取验证码图片
export function getVerifyCode() {
  return request({
    url: "/sewage-ums/userInfo/captcha",
    method: "get"
  });
}

// export function getInfo(token) {
//   return request({
//     url: "/vue-element-admin/user/info",
//     method: "get",
//     params: { token }
//   });
// }

// export function logout() {
//   return request({
//     url: "/vue-element-admin/user/logout",
//     method: "post"
//   });
// }
