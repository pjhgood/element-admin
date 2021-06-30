// 过滤出后台返回状态值对应的中文意思
export function filtered(options, currVal) {
  let currLable = null
  options &&
    options.forEach(item => {
      if (item.value === currVal) {
        currLable = item.label
      }
    })
  return currLable
}
// parentDefaultVal 父级最高级默认Id是多少
// childrenId 当前选择的最后一级
// ProductLineList 总数据
// keyField 当前对象的id代码名称 默认等于Id
// parentField 当前对象的parentId名称 默认等于ParentId
export function getParentId(
  childrenId,
  ProductLineList,
  keyField = 'id',
  parentField = 'parentId',
  parentDefaultVal = 0
) {
  var dataArr = []
  dataArr.push(childrenId)
  function oper() {
    for (let i = 0; i < ProductLineList.length; i++) {
      var parents = ProductLineList[i]
      if (parents[keyField] === childrenId) {
        if (dataArr.indexOf(1) !== -1) {
          break
        } else {
          if (parents[parentField] !== parentDefaultVal) {
            dataArr.unshift(parents[parentField])
            childrenId = parents[parentField]
            if (childrenId !== parentDefaultVal) {
              oper(childrenId)
            }
          }
        }
      }
    }
  }
  oper()
  return dataArr
}
// parentId 父级最高级默认Id是多少
// childrenField 当前children的字段名
// list 总数据
// keyField 当前对象的id代码名称 默认等于Id
// parentField 当前对象的parentId名称 默认等于parentId
export function listToTree(
  list,
  parentId,
  keyField = 'id',
  parentField = 'parentId',
  childrenField = 'children'
) {
  var children = []
  list.forEach(item => {
    if (!parentId) {
      if (!item[parentField]) {
        children.push(item)
        if (item[keyField]) {
          item[childrenField] = listToTree(
            list,
            item[keyField],
            keyField,
            parentField,
            childrenField
          )
        }
      }
    } else if (item[parentField] === parentId) {
      children.push(item)
      if (item[keyField]) {
        item[childrenField] = listToTree(list, item[keyField], keyField, parentField, childrenField)
      }
    }
  })
  return children.length === 0 ? null : children
}

/**
 * 计算页面高度
 * @param {*string} type 页签类型
 * @param {*string} activeName 待办或已办
 * @param {*number} totalCount table页数
 */
export function getTableHeight(moduleType, type, activeName, totalCount) {
  // 页面总视图高度
  const boxH = document.body.clientHeight
  // 查询
  const advancedSearch = document.getElementsByClassName('search-filter-wrap')[0]
    ? document.getElementsByClassName('search-filter-wrap')[0].clientHeight
    : 0
  // 横向页签切换
  const searchTabH = document.getElementsByClassName('search-tab')[0]
    ? document.getElementsByClassName('search-tab')[0].clientHeight
    : 0
  const paginationH = totalCount === 0 ? 0 : 50
  let height
  // type代表页面不同的结构
  if (type === 1) {
    if (activeName === 'pending') {
      height = boxH - 64 - 36 - 20 - advancedSearch - 48 - 20 - paginationH - 8
    } else {
      height = boxH - 64 - 36 - 20 - advancedSearch - 20 - 20 - paginationH - 8
    }
  } else if (type === 2) {
    height = boxH - 64 - 36 - 20 - advancedSearch - 48 - 20 - paginationH - 8
  } else if (type === 3) {
    height = boxH - 64 - 36 - 20 - searchTabH - advancedSearch - 48 - 20 - paginationH - 8
  }

  if (height < 400) {
    height = 400
  }
  return height
}

export function redevicePixe() {
  var zoom = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    if (zoom !== 1 && zoom !== 2 && zoom !== 3) {
      this.$message({
        type: 'warning',
        message: '您的设备对显示进行放大，可能导致页面显示不全,请调整后打开或使用其他浏览器！'
      })
    }
  } else {
    if (window.screen.availWidth >= 1280) {
      if (zoom !== 1 && zoom !== 2 && zoom !== 3) {
        document.getElementsByTagName('body')[0].style.zoom = 1 / window.devicePixelRatio
      }
    }
  }
}
