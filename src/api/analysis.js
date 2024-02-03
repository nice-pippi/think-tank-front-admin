import request from '@/utils/request'

// 用户统计分析
export function getUserStatistic() {
    return request({
      url: '/admin/analysis/getUserStatistic',
      method: 'get'
    })
}

// 统计近一周每日用户登录人数情况
export function getUserLoginCountBySevenDay() {
  return request({
    url: '/admin/analysis/getUserLoginCountBySevenDay',
    method: 'get'
  })
}

// 获取待处理板块申请记录数量
export function getTodoBlockApplyCount() {
  return request({
    url: '/admin/analysis/getTodoBlockApplyCount',
    method: 'get'
  })
}

// 获取待处理板主申请数量
export function getTodoMasterApplyCount() {
  return request({
    url: '/admin/analysis/getTodoMasterApplyCount',
    method: 'get'
  })
}

// 获取待处理举报帖子数量
export function getTodoReportPostCount() {
  return request({
    url: '/admin/analysis/getTodoReportPostCount',
    method: 'get'
  })
}

// 获取待处理举报评论数量
export function getTodoReportCommentCount() {
  return request({
    url: '/admin/analysis/getTodoReportCommentCount',
    method: 'get'
  })
}
  