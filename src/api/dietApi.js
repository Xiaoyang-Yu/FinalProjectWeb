import request from '@/utils/request'
import { Configuration, OpenAIApi} from 'openai'

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
  addBodyFatPercentage(bodyFatPercentage) {
    console.log(bodyFatPercentage)
    return request({
      url: '/sys/bodyFatPercentage',
      method: 'post',
      data: bodyFatPercentage
    })
  },
  // 在这个方法判断，决定点击表单确定按钮，是新增还是修改
  saveDiet(diet) {
    console.log(diet.id === null)
    if (diet.id === null || diet.id === undefined) {
      console.log('add')
      return this.addDiet(diet)
    }
    console.log('update')
    return this.updateDiet(diet)
  },
  getDietById(id) {
    return request({
      url: `/sys/diet/${id}`,
      method: 'get'
    })
  },
  getDietByUid(uid) {
    return request({
      url: `/sys/bodyFatPercentage/dietList?uid=${uid}`,
      method: 'get'
    })
  },
  getRecommendByUid(uid) {
    return request({
      url: `/sys/bodyFatPercentage/recommendList?uid=${uid}`,
      method: 'get'
    })
  },
  deleteDietById(id) {
    return request({
      url: `/sys/die/${id}`,
      method: 'delete'
    })
  },
  getBfpForm(id) {
    return request({
      url: `/sys/bodyFatPercentage/${id}`,
      method: 'delete'
    })
  },
  savebfpForm(bfpForm) {
    return this.addBodyFatPercentage(bfpForm)
  },
  getAPI(searchModel) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.VUE_APP_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chat_completion =  openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: searchModel.prompt}]
      // "man who weighs 85kg and is 170cm tall, and a 30-year-old office work the man with high blood pressure, diabetes, vegetarian, or Gluten allergies, give me a diet sheet that should include detailed information including 3 meals, names of food, units, protein grams, carbohydrates grams, fat grams, dietary fiber grams, sodium grams, and calories. output content must follow ```[{meal:'breakfast',details:[{name:'oats',units:'1 cup',protein:'6g',carbohydrates:'27g',fat:'3g',dietary_fiber:'4g',sodium:'0g',calories:'155 kcal'}]```,
    });
    return chat_completion
  }
}
