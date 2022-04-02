// 路由模块
const express = require("express");
const admin = require("./routes/admin");
// const Router = require('koa-router');
// const Auth =require('../middleware/auth')
let router = express.Router();
// 路由
router
  // 登录
  .post("/login", admin.Login)
  // 获取当前登录用户信息
  .get("/getinfo",admin.GetInfo)
  // 获取路由信息与侧边栏
  .post('/routerpage',admin.routerPage)
  // .post('/homepage',admin.Homepage)
  // 添加路由信息
  .post('/addrouterpage',admin.addRouterPage)
  // 获取菜单配置列表
  .post('/queryrouterlist',admin.QueryRouterList)
  // 删除路由信息
  .post('/deleterouterpage',admin.deleteRouterPage)
  // 修改菜单配置信息
  .post('/updaterouterlistpage',admin.UpdateRouterListPage)
  // 添加用户列表
  .post("/register", admin.Register)
  // 获取用户列表
  .post('/alluserpage',admin.AllUserPage)
  // 删除用户
  .post('/deleteuserpage',admin.DeleteUserpage)
  // 修改用户信息
  .post('/updateuserpage',admin.UpdateUserPage)
  // 修改用户密码
  .post('/updateuserpwd',admin.UpdateUserPwdMsq)
  // 给用户添加路由权限
  // .post('/upuserrouter',admin.upUserRouter)
  // 添加角色管理
  .post('/addrolemanagement',admin.AddRoleManagement)
  // 获取角色管理列表
  .post('/allRoleManagement',admin.AllRoleManagement)
  // 修改角色管理
  .post('/updateRoleManagement',admin.UpdateRoleManagement)
  // 添加角色人员
  .post('/addRolePersonnel',admin.AddRolePersonnel)
  // 添加角色路由权限
  .post('/addRolePermissions',admin.AddRolePermissions)
  // 获取角色人员管理
  .post('/allRolePersonnel',admin.AllRolePersonnel)
  // 获取角色路由权限
  .post('/allRolePermissions',admin.AllRolePermissions)
  // 添加表单列表
  .post('/addFormList',admin.AddFormList)
  // 修改表单列表
  .post('/modifyFormList',admin.ModifyFormList)
  // 获取表单列表
  .post('/getAllFormList',admin.GetAllFormList)
  // 添加修改表单配置列表
  .post('/addFormConfiguration',admin.AddFormConfiguration)
  // 获取表单配置列表
  .post('/getAllFormConfigurationList',admin.GetAllFormConfigurationList)
  // 页面获取表单信息
  .post('/getUserFormConfiguration', admin.getUserFormConfiguration)
  // 添加字典列表
  .post('/addDictionaryList', admin.AddDictionaryList)
  // 获取字典列表
  .post('/allDictionaryList', admin.AllDictionaryList)
  // 配置和修改字典项
  .post('/addDictionaryPage', admin.AddDictionaryPage)
  // 获取字典配置信息
  .post('/allDictionaryPage', admin.AllDictionaryPage)
  // 页面获取字典信息
  .post('/userDictionaryPage', admin.UserDictionaryPage)
  // 字典删除
  .post('/deleteDictionaryPage', admin.DeleteDictionaryPage)
  // 配置表单获取字典
  .post('/formDictionaryPage', admin.FormDictionaryPage)

module.exports = router


