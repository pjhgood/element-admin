import request from "@/utils/request"

// 获取所有用户
export function getAllUserByPage(data) {
  return request({
    url: "/sewage-ums/userInfo/getAllUserByPage",
    method: "post",
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/sewage-ums//userInfo/delete/${id}`,
    method: "delete"
  })
}

// 新增用户数据
export function createNewUser(data) {
  return request({
    url: "/sewage-ums/userInfo/createNewUser",
    method: "post",
    data
  })
}

// 修改用户数据
export function updateUser(data) {
  return request({
    url: "/sewage-ums/userInfo/updateUser",
    method: "post",
    data
  })
}
