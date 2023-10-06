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
  getDietByUid(uid) {
    return request({
      url: `/sys/bodyFatPercentage/dietList?uid=${uid}`,
      method: 'get'
    })
  },
  deleteDietById(id) {
    return request({
      url: `/sys/die/${id}`,
      method: 'delete'
    })
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
      // "A man who weighs 85kg and is 170cm tall, and a 30-year-old office work the man with high blood pressure, diabetes, vegetarian, or Gluten allergies, give me a diet sheet that should include detailed information including 3 meals, names of food, food units, protein grams, carbohydrates grams, fat grams, dietary fiber grams, sodium grams, and calories. output Format [{meal:breakfast,details:[{name:'egg',fat:'6g'}]...}]." }],
    });
    console.log(process.env)
    return chat_completion
  }
}
