// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
let Jwt = require('./util/token')
// 模块开发后台
const basicsRouter = require("./route/basics-router");
const reskRouter = require("./route/resk");

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
// // 设置静态资源目录
app.use(express.static(path.resolve("./public")));

//token验证中间件
app.use((req, res, next) => {
  const Uri = url.parse(req.url)
  const baseurl =Uri.pathname
  if (baseurl !== '/'&&baseurl!=='/basicsRouter/register' && baseurl !== '/basicsRouter/login'){
    let token = req.headers.authorization
    let jwt = new Jwt(token)
    let result = jwt.verifyToken()
    //解析出result
    if (result === 'err') {
        res.json({
          code: 4001,
          data: {
              token,
          },
          message: '令牌已失效，请重新登录'
      });
    } else {
      global.token = result
        next()
    }
  }else{
    next()
  }
})
// 用户管理将路由引入
app.use('/basicsRouter',basicsRouter);
app.use('/reskRouter',reskRouter);

app.listen(3000, function () {
  console.log("http://localhost:3000");
});