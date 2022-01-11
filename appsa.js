// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
// let Jwt = require('./util/token')
// 模块开发后台
// const basicsRouter = require("./route/basics-router");
// const reskRouter = require("./route/resk");

const bodyParser = require("body-parser");
const cors = require("cors");
let app = express();
var url=require('url');
//挂载参数处理中间件
app.use(cors());
//处理json格式的参数
app.use(bodyParser.json());
// 处理表单数据
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// 设置静态资源目录
app.use(express.static(path.resolve("./public")));
app.get('/reskRouter',(req,res,next)=>{
  console.log(next)
  console.log(req.body,'1111');
  res.json({
    code:200
  })
});
app.listen(3034, function () {
  console.log("http://localhost:3034");
});