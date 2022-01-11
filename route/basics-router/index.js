// 路由模块
const express = require("express");
const admin = require("./routes/admin");
// const Router = require('koa-router');
// const Auth =require('../middleware/auth')
let router = express.Router();
// 路由
router
  // 注册
  .post("/register", admin.Register)
  // 登录
  .post("/login", admin.Login)
  // 获取当前登录用户信息
  .get("/getinfo",admin.GetInfo)
  .post('/routerpage',admin.routerPage)
  .post('/homepage',admin.Homepage)
  // 添加路由信息
  .post('/addrouterpage',admin.addRouterPage)
  // 删除路由信息
  .post('/deleterouterpage',admin.deleteRouterPage)
  // 修改
  .post('/updaterouterlistpage',admin.UpdateRouterListPage)
  // 获取用户列表
  .post('/alluserpage',admin.AllUserPage)
  // 删除用户
  .post('/deleteuserpage',admin.DeleteUserpage)
  // 修改用户信息
  .post('/updateuserpage',admin.UpdateUserPage)
  // 修改用户密码
  .post('/updateuserpwd',admin.UpdateUserPwdMsq)
  // 用户管理获取列表
  .post('/queryrouterlist',admin.QueryRouterList)
  // 给用户添加路由权限
  .post('/upuserrouter',admin.upUserRouter)
  // 添加角色管理
  .post('/addrolemanagement',admin.AddRoleManagement)
  // 添加角色人员
  .post('/addRolePersonnel',admin.AddRolePersonnel)
  // 添加角色路由权限
  .post('/addRolePermissions',admin.AddRolePermissions)
  // 获取角色管理列表
  .post('/allRoleManagement',admin.AllRoleManagement)
  // 修改角色管理
  .post('/updateRoleManagement',admin.UpdateRoleManagement)
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
  
module.exports = router


