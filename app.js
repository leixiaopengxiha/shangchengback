// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
const fs = require('fs')
const moment = require('moment')
let Jwt = require('./util/token')
// 模块开发后台
const basicsRouter = require("./route/basics-router");
const applicationRouter = require("./route/application-router");
// const openAiRouter= require("./route/openai-router");
const socketRouter = require("./route/socket-router");


const bodyParser = require("body-parser");
const cors = require("cors");
let app = express();
var url=require('url');
const httpProxy = require('express-http-proxy')
const dateFormat = require('./util/dateFormat')
app.use(bodyParser.json({limit : "5000000000kb"}));

const multer = require("multer");
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
let objMulter = multer({ dest: "./public/upload" });
//实例化multer，传递的参数对象，dest表示上传文件的存储路径
app.use(objMulter.any())//any表示任意类型的文件
// app.use(objMulter.image())//仅允许上传图片类型
const log4js= require('./log-config')
const logger = log4js.getLogger()//根据需要获取logger
const errlogger = log4js.getLogger('err')
const othlogger = log4js.getLogger('oth')
//结合express使用，记录请求日志
log4js.useLogger(app,logger)//这样会自动记录每次请求信息，放在其他use上面

const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
  
let io =socketIO(server,{
    cors: {
        origin: '*'
    }
});
socketRouter(io)
// 定时任务清楚日志文件
let yitina = 24*60*60*1000
// let yitina = 1000
function clearLogsFun(){
  let time = new Date().getTime()
  let logsfs = fs.readdirSync('./logs');
  let jin = moment().format("YYYY-MM-DD")
  let qian  = moment(time-yitina).format("YYYY-MM-DD")
  let daqian =  moment(time-(yitina*2)).format("YYYY-MM-DD")
  function unlinkSync(item){
    fs.unlinkSync(`./logs/${item}`,function (err) {
      if (err) throw err;
    });
  }

  logsfs.map(item=>{
    if(item.indexOf(jin) == -1){
      if(item.indexOf(qian) == -1){
        if(item.indexOf(daqian)== -1 ){
          unlinkSync(item);
        }
      }
    }
  })
}

let config = {//参数的说明
  interval: 1, //间隔天数，间隔为整数
  runNow: true, //是否立即运行
  time: "01:00:00" //执行的时间点 时在0~23之间
}

dateFormat.timeoutFunc(clearLogsFun,config)
//token验证中间件
app.use((req, res, next) => {
  const Uri = url.parse(req.url)
  const baseurl =Uri.pathname
  let arr =[
    '/',
    '/basicsRouter/register',
    '/basicsRouter/login',
    '/basicsRouter/imgpage',
    // '/openAiRouter/GenerateAi'
  ];
  console.log(baseurl);
  let isbaseurl =  arr.some(item=>item==baseurl)
  console.log(isbaseurl);
  // if(!isbaseurl&&arr.indexOf()){}
  if (!isbaseurl){
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
      req.headers.userId = result
      if(!global.userObj){
        global.userObj = {}
      }
      global.userObj[result] = result
      console.log(global.userObj);
      next()
    }
  }else{
    next()
  }
})
// 用户管理将路由引入
app.use('/basicsRouter',basicsRouter);
app.use('/applicationRouter',applicationRouter);
// app.use('/openAiRouter', openAiRouter);
// node后期开的微服务与网关使用
const userServiceProxy = httpProxy('http://localhost:3034')
app.use('/aaa', (req,res)=>{
  userServiceProxy(req, res, (errs)=>{
    res.json({
      code:0,
      err: req.originalUrl,
      msg:'网关或后台服务可能开小差了，请稍后重试',
    })
    errlogger.error('pathname: ',req.originalUrl,'headers: ',req.headers,'query: ',req.query,'params ',req.params,'body: ',req.body,'errs: ',errs)
 })
})


server.listen(3033, function () {
  console.log("http://localhost:3033");
});