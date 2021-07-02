import request from "@/utils/request";

// 采样点列表查询
export function sewageCheckPointList(data) {
  return request({
    url: "/sc/sewageCheckPoint/list",
    method: "post",
    data
  });
}

// 删除单条数据
export function deleteSewageCheckPoint(id) {
  return request({
    url: `/sc/sewageCheckPoint/delete/${id}`,
    method: "delete"
  });
}

// 修改一条数据
export function updateSewageCheckPoint(data) {
  return request({
    url: "/sc/sewageCheckPoint/update",
    method: "post",
    data
  });
}

// 保存一条数据
export function saveSewageCheckPoint(data) {
  return request({
    url: "/sc/sewageCheckPoint/save",
    method: "post",
    data
  });
}

// 污水检测结果列表查询
export function sewageDCICheckResList(data) {
  return request({
    url: "/sc/sewageCheckPoint/sewageDCICheckResList",
    method: "post",
    data
  });
}

// 新增污水检测结果数据
export function saveSewageDCICheckRes(data) {
  return request({
    url: "/sc/sewageCheckPoint/saveSewageDCICheckRes",
    method: "post",
    data
  });
}

// 修改一条污水检测结果数据
export function updateDCICheckRes(data) {
  return request({
    url: "/sc/sewageCheckPoint/updateDCICheckRes",
    method: "post",
    data
  });
}

// 删除一条污水检测结果数据
export function removeDCICheckRes(id) {
  return request({
    url: `/sc/sewageCheckPoint/removeDCICheckRes/${id}`,
    method: "delete"
  });
}

// 查询一条污水检测结果数据
export function findDCICheckRes(id) {
  return request({
    url: `/sc/sewageCheckPoint/findDCICheckRes/${id}`,
    method: "post"
  });
}

// 检测点下拉选项
export function allCheckPoints() {
  return request({
    url: "/sc/sewageCheckPoint/allCheckPoints",
    method: "post"
  });
}

// 查询模板列表字段
export function publicSqlFieldConfig(templateCode) {
  return request({
    url: `/sc/publicSqlFieldConfig/queryFields?templateCode=${templateCode}`,
    method: "get"
  });
}

// 一点一档列表查询
export function oneSewageCheckPointoneDocList(data) {
  return request({
    url: "/sc/sewageCheckPoint/oneSewageCheckPointoneDocList",
    method: "post",
    data
  });
}

// 一点一档检测结果列表查询
export function oneSewageCheckPointOneDocRecordList(data) {
  return request({
    url: "/sc/sewageCheckPoint/oneSewageCheckPointOneDocRecordList",
    method: "post",
    data
  });
}
