import request from '@/utils/request'

export default {
  getDietListDefault(searchModel) {
    return request({
      url: '/sys/diet/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        recipe: searchModel.recipe
      }
    })
  },
  addDiet(diet) {
    return request({
      url: '/sys/diet',
      method: 'post',
      data: diet
    })
  },
  updateDiet(diet) {
    return request({
      url: '/sys/diet',
      method: 'put',
      data: diet
    })
  },
  // 在这个方法判断，决定点击表单确定按钮，是新增还是修改
  saveDiet(diet) {
    if (diet.dietId == null && diet.dietId === undefined) {
      return this.addDiet(diet)
    }
    return this.updateDiet(diet)
  },
  getDietById(id) {
    return request({
      url: `/sys/diet/${id}`,
      method: 'get'
    })
  },
  deleteDietById(id) {
    return request({
      url: `/sys/die/${id}`,
      method: 'delete'
    })
  },
  getAPI(searchModel){
    return request({
      url: '/sys/diet/gptAPI',
      method: 'get',
      params: {
        prompt: searchModel.prompt
      },
      timeout: 50000
    })
  },
}
