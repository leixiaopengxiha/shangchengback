// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
let Jwt = require('./util/token')
const router = require("./route");

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
  if (baseurl !== '/'&&baseurl!=='/register' && baseurl !== '/login'){
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
// 将路由引入
app.use(router);
// app.post('/routerhome', (req, res) => {
//   res.json({
//     code: 200,
//     data: [
//       {
//         id: 1,
//         path: '/home',
//         name: 'Home',
//         pid: '',
//         sortid: 1,
//         title: '首页',
//         icon: '',
//         sidebar:1,
//         component: 'views/Home.vue'
//       },
//       {
//         id: 2,
//         path: '/about',
//         name: 'About',
//         pid: '',
//         sortid: 1,
//         title: '关于',
//         icon: '',
//         sidebar:1,
//         component: 'views/router.vue'
//       },
//       {
//         id: 3,
//         path: '/about/myas',
//         name: 'Myas',
//         pid: 2,
//         sortid: 1,
//         title: '我的',
//         icon: '',
//         sidebar:1, 
//         component: 'views/myas.vue'
//       },
//       {
//           id:4,
//           path: '/about/myas/haha',
//           name: 'Haha',
//           pid: 3,
//           sortid: 1,
//           title: '哈哈@',
//           icon: '',
//           sidebar:1, // 是否加入侧边栏
//           component: 'views/haha.vue'
//       },
//       {
//         id:5,
//         path: '/about/myas/haha',
//         name: 'Haha',
//         pid: 4,
//         sortid: 1,
//         title: '哈哈@',
//         icon: '',
//         sidebar:1, // 是否加入侧边栏
//         component: 'views/haha.vue'
//     },
//     ]
//   })
// })

app.listen(3000, function () {
  console.log("http://localhost:3000");
});