// 1.引入管理员模块
// jwt 
let md5 = require('md5-node');
let { dateFormat } = require('../../../util/dateFormat')
let userMsq = require('../../../msq/user')

let Jwt = require('../../../util/token');

const log4js= require('../../../log-config')
const othlogger = log4js.getLogger('oth')

// const path = require("path");
const fs = require('fs')
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
        '/images/touxiang/1.webp',
        '/images/touxiang/2.webp',
        '/images/touxiang/3.webp',
        '/images/touxiang/4.webp',
        '/images/touxiang/5.webp'
    ]
    password = password.toString(2)
    password = md5(parseInt(password, 16))
    password = password.split('').reverse().join('')
    password = md5(password)

    let rilist = {
        username,
        password,
        nickname: '欢迎' + username,
        avatar: img[idxa],
        introduction: username + '欢迎您的加入',
        date: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
        operationtime:dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
    }
    // 调用数据库
    userMsq.RegistrationMsq(rilist, (data) => {
        if(data.code == 2000){
            let userList =  {
                List: [username],
                roleId: "4000000000000008",
                isRoleIds:true,
            }
            let datas = []
            userList.List.map(item=>{
                datas.push([0,item,userList.roleId])
            })
            userList.sqlList = datas
            userMsq.setAddRolePersonnel(userList,(docd)=>{
                if (!docd.data) {
                    res.json(docd)
                    return
                }
                res.json(data)
            })
        }else{
            res.json(data)
        }
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
    userMsq.LoginMsq(datas, (docs) => {
        if (!docs.data) {
            res.json(docs)
            return
        }
        let jwt = new Jwt(datas.username)
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
    userMsq.GetInfoMsq({ username: result }, (docs) => {
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

// // 获取token 
// exports.Homepage = (req, res) => {
//     res.json({
//         code: 2000
//     })
// }

// 删除用户
exports.DeleteUserpage = (req,res)=>{
    userMsq.deleteUserMsq(req.body.id,(docs)=>{
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
    if(req.body.userId){
        result = req.body.userId
    }
    if(!result){
        othlogger.info({
            data: {
                userId:result,
            },
            message: '获取路由信息'
        })
    }
    userMsq.AllRoterTapListMsq({userId:result},(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        if(!docs.data.length){
            res.json({
                code:50008,
                message: "该用户未开通路由"
            })
            return
        }
        res.json({
            code: 2000,
            data: docs.data,
            message: "路由信息获取成功"
        });
    })
}
// 用户管理页面信息
exports.QueryRouterList= (req, res) => {
    userMsq.GetQueryRouterListMsq(req.body,(docs)=>{
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
    userMsq.GetAddRouterMsq(req.body, (doc) => {
        if (!doc.data) {
            res.json(doc)
            return
        }
        let datas = []
        let userList =  {
            List: [doc.data.insertId],
            roleId: "4000000000000007"
        }
        userList.List.map(item=>{
             datas.push([0,item,userList.roleId,null])
        })
        userList.sqlList = datas
        // 给管理员添加路由权限
        userMsq.setAddRolePermissions(userList,(docd)=>{
            if (!docd.data) {
                res.json(docd)
                return
            }
            res.json({
                code: 2000,
                message: "添加成功"
            });
        },true)
    })
}

// 删除路由信息
exports.deleteRouterPage=(req,res)=>{
    userMsq.deleteRouterListMsqs(req.body.id,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
        // 删除用户权限路由
        userMsq.DeleteRolePermissionsMsq(req.body.id,(deleRol)=>{
            if(!deleRol.data){
                res.json(deleRol)
                return
            }
            res.json({
                code: 2000,
                message: "删除成功"
            });
        })
   })
}
// 修改路由信息
exports.UpdateRouterListPage = (req,res)=>{
    userMsq.UpdateRouterListMsq(req.body,(docs)=>{
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
    userMsq.AllUserMsq(req.body,(docs)=>{
        if (!docs.data) {
            res.json(docs)
            return
        }
       let datas= docs.data[1].map(item=>{
           delete item.password
        //    item.roles = JSON.parse(item.roles)
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
    userMsq.UpdateUserMsqs(req.body,(docs)=>{
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

// 管理员修改用户M密码
exports.UpdateUserPwdMsq = (req,res)=>{
    let datas = req.body
    datas.password = datas.password.toString(2)
    datas.password = md5(parseInt(datas.password, 16))
    datas.password = datas.password.split('').reverse().join('')
    datas.password = md5(datas.password)
    userMsq.UpdateUserPwdMsqs(datas,(docs)=>{
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
// 用户修改密码
exports.UpdatePwdMsqs = (req,res)=>{
    let datas = req.body
    // 新密码加密
    datas.password = datas.password.toString(2)
    datas.password = md5(parseInt(datas.password, 16))
    datas.password = datas.password.split('').reverse().join('')
    datas.password = md5(datas.password)
    // 原始密码加密
    datas.yspassword = datas.yspassword.toString(2)
    datas.yspassword = md5(parseInt(datas.yspassword, 16))
    datas.yspassword = datas.yspassword.split('').reverse().join('')
    datas.yspassword = md5(datas.yspassword)
    userMsq.UpdatePwdMsqs(datas,(docs)=>{
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
// // 给用户添加路由权限
// exports.upUserRouter=(req,res)=>{
//     let data = req.body
//     console.log(data,'给用户添加路由权限')
//     // userMsq.UpdateRouterMsq({roles:JSON.stringify(data.roles),username:data.username },(docd)=>{
//     //     if (!docd.data) {
//     //         res.json(docd)
//     //         return
//     //     }
//     //     res.json({
//     //         code: 2000,
//     //         message: "保存成功"
//     //     });
//     // })
// }
// 新增角色管理
exports.AddRoleManagement = (req,res)=>{
    let data = req.body
    userMsq.setAddRoleManagement(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}
// 获取角色管理列表
exports.AllRoleManagement = (req,res)=>{
    let data = req.body
    userMsq.getAllRoleManagement(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let total = docd.data[0][0].total
       let dataList =  docd.data[1].filter(item=>{
            if(item.id=='4000000000000007'){
                total-=1
            }else{
               return item 
            }
        })
        res.json({
            code: 2000,
            total: total,
            data: dataList,
            message: "获取成功"
        });
    })
}

// 修改角色管理
exports.UpdateRoleManagement =  (req,res) => {
  
    let data = req.body
    userMsq.UpdateRoleManagementMsq(data,(docs)=>{
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

// 新增角色人员管理
exports.AddRolePersonnel = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    let datas = []
    data.list.map(item=>{
         datas.push([0,item,data.roleId])
    })
    data.sqlList = datas
    userMsq.setAddRolePersonnel(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}
// 获取角色人员管理
exports.AllRolePersonnel  = (req,res)=>{
    let data = req.body
    userMsq.AllRolePersonnelMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let arr = docd.data.length!=0?docd.data.map(item=>item.userId):[]
        res.json({
            code: 2000,
            data: arr,
            message: "获取成功"
        });
    })
}

// 添加角色路由权限
exports.AddRolePermissions  = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    let datas = []
    data.list.map(item=>{
         datas.push([0,item,data.roleId,0])
    })
    data.halfCheckedKeys.map(item=>{
        datas.push([0,item,data.roleId,1])
    })
    data.sqlList = datas
    userMsq.setAddRolePermissions(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}

// 获取角色路由权限
exports.AllRolePermissions  = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AllRolePermissionsMsq(data.roleId,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let arr = docd.data.length!=0?docd.data.map(item=>item.routerId):[]
        res.json({
            code: 2000,
            data:arr,
            message: "获取成功"
        });
    })
}

// 新增表单列
exports.AddFormList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AddFormListMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}
// 修改表单列
exports.ModifyFormList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.ModifyFormListMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "修改成功"
        });
    })
}

// 获取表单列表
exports.GetAllFormList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.GetAllFormListMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let total = docd.data[0][0].total
        let dataList =  docd.data[1]
        res.json({
             code: 2000,
             total: total,
             data: dataList,
             message: "获取成功"
        });
    })
}

// 新增修改表单列
exports.AddFormConfiguration = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AddFormConfigurationMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}


// 获取表单配置列表
exports.GetAllFormConfigurationList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AllFormConfigurationMsq(data.formId,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let datas = docd.data.map(item=>{
            item.rules = JSON.parse(item.rules)
            return item
        })
        res.json({
             code: 2000,
             data: datas,
             message: "获取成功"
        });
    })
}
// 用户获取表单信息
exports.getUserFormConfiguration = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    data.creationTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    userMsq.UserFormConfigurationMsq(data.formId,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        if(docd.data.length==0){
            res.json({
                code: 2000,
                data: docd.data,
                message:'该表单暂未进行配置或者是已被禁用',
            });
            return
        }
        let datas = docd.data.map(item=>{
            item.rules = JSON.parse(item.rules)
            return item
        })
        res.json({
            code: 2000,
            data: datas,
            message: "获取成功"
        });
        
    })
}

// 新增字典列表
exports.AddDictionaryList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    data.creationTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    userMsq.AddDictionaryListMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}

// 获取字典列表
exports.AllDictionaryList = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AllDictionaryListMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        let total = docd.data[0][0].total
        let dataList =  docd.data[1]
        res.json({
             code: 2000,
             total: total,
             data: dataList,
             message: "获取成功"
        });
    })
}

// 新增字典配置
exports.AddDictionaryPage = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    data.creationTime=dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    userMsq.AddDictionaryPageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}

// 获取字典配置信息
exports.AllDictionaryPage  = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.AllDictionaryPageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data: docd.data,
            message: "获取成功"
        });
    })
}
// 配置表单获取字典
exports.FormDictionaryPage = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.FormDictionaryPageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data: docd.data,
            message: "获取成功"
        });
    })
}
// 用户获取字典信息
exports.UserDictionaryPage = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.UserDictionaryPageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data: docd.data,
            message: "获取成功"
        });
    })
}

// 字典删除
exports.DeleteDictionaryPage = (req,res)=>{
    let data = JSON.parse(JSON.stringify(req.body))
    userMsq.DeleteDictionaryPageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{id:docd.data.insertId},
            message: "保存成功"
        });
    })
}


// 录像删除
exports.Imgpage = (req,res)=>{
    console.log( req.files.length);
    let oldName = req.files[0].filename;//获取名字
    let originalname=req.files[0].originalname;//originnalname其实就是你上传时候文件起的名字
    //给新名字加上原来的后缀
    let newName = req.files[0].originalname;
    fs.renameSync('./public/upload/'+oldName, './public/upload/'+newName+'.png');//改图片的名字注意此处一定是一个路径，而不是只有文件名
    let data = {
        id:req.body.id,
        imgUrl:`/upload/+${newName}.png`
    }
    userMsq.ImgpageMsq(data,(docd)=>{
        if (!docd.data) {
            res.json(docd)
            return
        }
        res.json({
            code: 2000,
            data:{
                url:`/upload/+${newName}.png`
            },
            message: "保存成功"
        });
    })
}