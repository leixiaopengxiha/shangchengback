let { Configuration, OpenAIApi } = require("openai");
let {OPENAI_API_KEY} = require('../../../util/ChatGPT')
const log4js= require('../../../log-config')
const othlogger = log4js.getLogger('oth')
const configuration = new Configuration({
  // apiKey: OPENAI_API_KEY,
  organization: "org-xpMoAv99i8jdZvhGXPfiRXug",
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.GenerateAiFun = async  (req, res) =>{
  console.log(req.body);
  console.log(configuration.apiKey);
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API密钥未配置，请遵循说明",
      }
    });
    return;
  }
  const animal = req.body.animal || '';
  
  const aiModel =req.body.aiModel&&req.body.aiModel.length? req.body.aiModel : 'text-davinci-003' 
  console.log(aiModel);
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "请输入有效的内容",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      // model: "text-curie-001",
      model: aiModel,
      prompt: animal,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // res.status(200).json({ data: completion.data.choices[0],code:2000 });
    const text = completion.choices[0].text.trim();
    res.send({ text ,code:2000 });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      othlogger.info({
        message: `status: ${error.response.status}error: ${error.response.data}`
      })

   
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`OpenAI API请求出错: ${error.message}`);
      othlogger.info({
        message: `OpenAI API请求出错: ${error.message}`
      })
      res.status(500).json({
        error: {
          message: '请求过程中出错.',
        }
      });
    }
  }
}




