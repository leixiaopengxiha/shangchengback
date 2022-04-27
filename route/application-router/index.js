// 路由模块
const express = require("express");
const bookKeeping = require("./routes/bookKeeping");
// const Router = require('koa-router');
// const Auth =require('../middleware/auth')
let router = express.Router();
// 路由
router
  .post("/addBookKeeping", bookKeeping.addBookKeeping) // 新增记账


  
module.exports = router


