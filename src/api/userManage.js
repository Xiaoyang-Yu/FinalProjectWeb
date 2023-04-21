import request from '@/utils/request'

export default {
  getUserListDefault(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    })
  },
  addUser(user) {
    return request({
      url: '/user',
      method: 'post',
      data: user
    })
  },
  updateUser(user) {
    return request({
      url: '/user',
      method: 'put',
      data: user
    })
  },
  // 在这个方法判断，决定点击表单确定按钮，是新增还是修改
  saveUser(user) {
    if (user.id == null && user.id === undefined) {
      return this.addUser(user)
    }
    return this.updateUser(user)
  },
  getUserById(id) {
    return request({
      // url: '/user',
      url: `/user/${id}`,
      method: 'get'
    })
  },
  deleteUserById(id) {
    return request({
      // url: '/user',
      url: `/user/${id}`,
      method: 'delete'
    })
  }
}
