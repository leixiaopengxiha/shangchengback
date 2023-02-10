// 路由模块
const express = require("express");
const openAi = require("./routes/openai");
// const Router = require('koa-router');
// const Auth =require('../middleware/auth')
let router = express.Router();
// 路由
router
  // ai智能
  .post("/GenerateAi", openAi.GenerateAiFun)


module.exports = router


