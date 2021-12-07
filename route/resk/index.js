// 路由模块
const express = require("express");
const admin = require("./routes/admin");
// const Router = require('koa-router');
// const Auth =require('../middleware/auth')
let router = express.Router();
// 路由
router
  .post("/asd", admin.Asd)


  
module.exports = router


