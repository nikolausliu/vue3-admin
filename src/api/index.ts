import request from '@/request'
export default {
  login(params: Recordable) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
    })
  },
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      params: {},
    })
  },
  getMenuList(params: Recordable) {
    return request({
      url: '/menus/list',
      method: 'get',
      params,
    })
  },
  getPermissionList() {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      params: {},
    })
  },
  getUserList(params: Recordable) {
    return request({
      url: '/users/list',
      method: 'get',
      params,
    })
  },
  getAllUserList() {
    return request({
      url: '/users/all/list',
      method: 'get',
      params: {},
    })
  },
  userDel(params: Recordable) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
    })
  },
  getRoleAllList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      params: {},
    })
  },
  getRoleList(params: Recordable) {
    return request({
      url: '/roles/list',
      method: 'get',
      params,
    })
  },
  getDeptList(params: Recordable) {
    return request({
      url: '/depts/list',
      method: 'get',
      params,
    })
  },
  deptOperate(params: Recordable) {
    return request({
      url: '/depts/operate',
      method: 'post',
      data: params,
    })
  },
  userSubmit(params: Recordable) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
    })
  },
  menuSubmit(params: Recordable) {
    return request({
      url: '/menus/operate',
      method: 'post',
      data: params,
    })
  },
  roleOperate(params: Recordable) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
    })
  },
  updatePermission(params: Recordable) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
    })
  },
  getApplyList(params: Recordable) {
    return request({
      url: '/leave/list',
      method: 'get',
      params,
    })
  },
  leaveOperate(params: Recordable) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
    })
  },
  leaveApprove(params: Recordable) {
    return request({
      url: '/leave/approve',
      method: 'post',
      data: params,
    })
  },
}
