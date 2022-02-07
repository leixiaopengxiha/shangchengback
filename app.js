// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
const fs = require('fs')
const moment = require('moment')
let Jwt = require('./util/token')
// 模块开发后台
const basicsRouter = require("./route/basics-router");
const reskRouter = require("./route/resk");

const bodyParser = require("body-parser");
const cors = require("cors");
let app = express();
var url=require('url');
const httpProxy = require('express-http-proxy')
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

const log4js= require('./log-config')
const logger = log4js.getLogger()//根据需要获取logger
const errlogger = log4js.getLogger('err')
const othlogger = log4js.getLogger('oth')
//结合express使用，记录请求日志
log4js.useLogger(app,logger)//这样会自动记录每次请求信息，放在其他use上面

// 定时任务清楚日志文件
let yitina = 24*60*60*1000
// let yitina = 1000
function clearLogsFun(){
  let time = new Date().getTime()
  let logsfs = fs.readdirSync('./logs');
  let jin = moment().format("YYYY-MM-DD")
  let qian  = moment(time-yitina).format("YYYY-MM-DD")
  let daqian =  moment(time-(yitina*2)).format("YYYY-MM-DD")
  logsfs.map(item=>{
    console.log(item.indexOf(jin),jin,qian,daqian)
    if(item.indexOf(jin)=='-1'||item.indexOf(qian)=='-1'){
      fs.unlinkSync(`./logs/${item}`,function (err) {
        if (err) throw err;
    });
    }
  })
}
// clearLogsFun()
setInterval(()=>{
  clearLogsFun()
},yitina)

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
      othlogger.info({
        code: 4001,
        data: {
            token,
        },
        message: '令牌已失效，请重新登录'
    })
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
const userServiceProxy = httpProxy('http://localhost:3034')
// 后期开的微服务与网关使用
app.use('/aaa', (req,res,next)=>{
  console.log('aaa')
  userServiceProxy(req, res, (errs)=>{
    res.json({
      code:0,
      err: req._parsedOriginalUrl.pathname,
      msg:'网关或后台服务可能开小差了，请稍后重试',
    })
    errlogger.error('pathname: ',req._parsedOriginalUrl.pathname,'headers: ',req.headers,'query: ',req.query,'params ',req.params,'body: ',req.body,'errs: ',errs)
 })
})


app.listen(3033, function () {
  console.log("http://localhost:3033");
});