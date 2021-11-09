// 1.引入管理员模块
// jwt 
let md5 = require('md5-node');
let { dateFormat } = require('../../util/dateFormat')
let { RegistrationMsq, LoginMsq, GetInfoMsq, GetRouterMsq, GetRouterListMsq, GetAddRouterMsq,UpdateRouterMsq,deleteRouterListMsqs,UpdateRouterListMsq,AllUserMsq,deleteUserMsq,UpdateUserMsqs, UpdateUserPwdMsqs,GetQueryRouterListMsq} = require('../../msq/user')

let Jwt = require('../../util/token');

// const path = require("path");
// const fs = require('fs')
// 注册
exports.Register = (req, res) => {
    let {
        username,
        password,
    } = req.body
    if (!username || username.length === 0) {
        return res.json({
            coode: '444',
            message: '请输入账号'
        })
    }
    if (!password || password.length < 6) {
        return res.json({
            coode: '444',
            message: '请输入密码并且密码长度不能小于6位'
        })
    }
    let idxa = Math.floor(Math.random() * 5);
    let img = [
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic25.nipic.com%2F20121107%2F8847866_164210379199_2.jpg&refer=http%3A%2F%2Fpic25.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619758500&t=d38cfd998ad20ff7fbb6db341d88dfff',
        'http://img1.imgtn.bdimg.com/it/u=3311096003,2459030550&fm=26&gp=0.jpg',
        'http://img4.imgtn.bdimg.com/it/u=3032770652,458815004&fm=26&gp=0.jpg',
        'http://img4.imgtn.bdimg.com/it/u=1825300561,2663961625&fm=26&gp=0.jpg',
        'http://img3.imgtn.bdimg.com/it/u=1363526049,1483812480&fm=11&gp=0.jpg'
    ]
    password = password.toString(2)
    password = md5(parseInt(password, 16))
    password = password.split('').reverse().join('')
    password = md5(password)

    let roles = ['9']
    let rilist = {
        username,
        password,
        nickname: '欢迎' + username,
        avatar: img[idxa],
        introduction: username + '欢迎您的加入',
        roles,
        date: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
        operationtime:dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
    }
    // 调用数据库
    RegistrationMsq(rilist, (data) => {
        res.json(data)
    })
}

// 登录
exports.Login = (req, res) => {
    let datas = req.body
    datas.password = datas.password.toString(2)
    datas.password = md5(parseInt(datas.password, 16))
    datas.password = datas.password.split('').reverse().join('')
    datas.password = md5(datas.password)
    datas.operationtime=dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
    LoginMsq(datas, (docs) => {
        if (!docs.data) {
            res.json(docs)
            return
        }
        let jwt = new Jwt(docs.data.username)
        let token = jwt.generateToken()
        res.json({
            code: 20000,
            data: {
                token,
            },
            message: "登录成功"
        });
    })
}

// 获取当前登录用户信息
exports.GetInfo = (req, res) => {
    let token = req.headers.authorization
    let jwt = new Jwt(token)
    let result = jwt.verifyToken()
    GetInfoMsq({ username: result }, (docs) => {
        if (!docs.data) {
            res.json(docs)
            return
        }
        res.json({
            code: 20000,
            data: {
                ...docs.data,
            },
            message: "登录成功"
        });
    })
}

// 获取token 
exports.Homepage = (req, res) => {
    res.json({
        code: 2000
    })
}

// 删除用户
exports.DeleteUserpage = (req,res)=>{
    deleteUserMsq(req.body.id,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        res.json({
            code: 2000,
            message: "删除成功"
        });
    })
}

// 获取路由信息
exports.routerPage = (req, res) => {
    let token = req.headers.authorization
    let jwt = new Jwt(token)
    let result = jwt.verifyToken()
    GetRouterMsq({ username: result }, (docs) => {
        if (!docs.data) {
            res.json(docs)
            return
        }
        let roles = JSON.parse(docs.data.roles)
        roles = roles.join(',')
        GetRouterListMsq(roles, (docs) => {
            if (!docs.data) {
                res.json(docs)
                return
            }
            res.json({
                code: 2000,
                data: docs.data,
                message: "路由信息获取成功"
            });
        })

    })
}
// 用户管理页面信息
exports.QueryRouterList= (req, res) => {
    GetQueryRouterListMsq(req.body,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        let dataList =  docs.data[1].map(item=>{
            item.cascader = item.cascader?JSON.parse(item.cascader):[0];
            return item
         })
         res.json({
            code: 2000,
            total:docs.data[0][0].total,
            data:dataList,
            message: "获取成功"
        });
    })

};
// 添加路由信息
exports.addRouterPage = (req, res) => {
    let token = req.headers.authorization
    let jwt = new Jwt(token)
    let result = jwt.verifyToken()
    // 添加
    GetAddRouterMsq(req.body, (doc) => {
        if (!doc.data) {
            res.json(doc)
            return
        }
        // 查询
        GetRouterMsq({ username: result }, (docs) => {
            if (!docs.data) {
                res.json(docs)
                return
            }
            let roles= JSON.parse(docs.data.roles)
            roles.push(doc.data.insertId)
            // 修改
            UpdateRouterMsq({roles:JSON.stringify(roles),username: result },(docd)=>{
                if (!docd.data) {
                    res.json(docd)
                    return
                }
                res.json({
                    code: 2000,
                    message: "添加成功"
                });

            })
        })
    })
}

// 删除路由信息
exports.deleteRouterPage=(req,res)=>{
   deleteRouterListMsqs(req.body.id,(docs)=>{
    if (!docs.data) {
        res.json(docs)
        return
    }
    res.json({
        code: 2000,
        message: "删除成功"
    });
   })
}
// 修改路由信息
exports.UpdateRouterListPage = (req,res)=>{
    UpdateRouterListMsq(req.body,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        res.json({
            code: 2000,
            message: "修改成功"
        });
    })
}
// 获取用户列表
exports.AllUserPage = (req,res)=>{
    AllUserMsq(req.body,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
       let datas= docs.data[1].map(item=>{
           delete item.password
           item.roles = JSON.parse(item.roles)
           item.date = dateFormat("YYYY-mm-dd HH:MM:SS",  item.date)
           item.operationtime =  item.operationtime?dateFormat("YYYY-mm-dd HH:MM:SS",  item.operationtime): item.operationtime
           return item
        })
        res.json({
            code: 2000,
            total:docs.data[0][0].total,
            data:datas,
            message: "获取成功"
        });
    })
}
// 修改用户
exports.UpdateUserPage = (req,res)=>{
    UpdateUserMsqs(req.body,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        res.json({
            code: 2000,
            message: "修改成功"
        });
    })
}

// 修改用户M密码
exports.UpdateUserPwdMsq = (req,res)=>{
    let datas = req.body
    datas.password = datas.password.toString(2)
    datas.password = md5(parseInt(datas.password, 16))
    datas.password = datas.password.split('').reverse().join('')
    datas.password = md5(datas.password)
    UpdateUserPwdMsqs(datas,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        res.json({
            code: 2000,
            message: "修改成功"
        });
    })
}

// 给用户添加路由权限
exports.upUserRouter=(req,res)=>{
    let data = req.body
    UpdateRouterMsq({roles:JSON.stringify(data.roles),username:data.username },(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            message: "保存成功"
        });
    })
}
